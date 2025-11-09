from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.utils.timezone import now
from .models import Auction, Bid
from .serializers import AuctionSerializer, BidSerializer
from apps.users.permissions import AdminOrDocente
from apps.coins.models import Wallet
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError


class AuctionViewSet(viewsets.ModelViewSet):
    queryset = Auction.objects.all()
    serializer_class = AuctionSerializer
    permission_classes = [AdminOrDocente]

    def perform_create(self, serializer):
        serializer.save(creador=self.request.user)

    @action(detail=True, methods=["post"], permission_classes=[AdminOrDocente])
    def close(self, request, pk=None):
        auction = self.get_object()
        if auction.estado != "active":
            return Response({"detail": "La subasta ya está cerrada."}, status=400)

        # Marcar como cerrada
        auction.estado = "closed"
        auction.save()

        # Obtener la puja más alta
        highest_bid = auction.bids.order_by("-cantidad").first()

        if highest_bid:
            ganador = highest_bid.estudiante
            monto = highest_bid.cantidad

            # 1. Cobrar coins al ganador
            wallet_ganador = Wallet.objects.get(usuario=ganador, periodo=auction.periodo)
            wallet_ganador.bloqueado -= monto
            wallet_ganador.saldo -= monto
            wallet_ganador.save()

            # 2. Devolver coins a los demás
            otras_pujas = auction.bids.exclude(id=highest_bid.id)
            for bid in otras_pujas:
                wallet = Wallet.objects.get(usuario=bid.estudiante, periodo=auction.periodo)
                wallet.bloqueado -= bid.cantidad
                wallet.save()

            return Response({"detail": f"Subasta cerrada. Ganador: {ganador.email}, Monto: {monto}"})

        return Response({"detail": "Subasta cerrada sin pujas."})

class BidViewSet(viewsets.ModelViewSet):
    queryset = Bid.objects.all()
    serializer_class = BidSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        auction = serializer.validated_data["auction"]
        cantidad = serializer.validated_data["cantidad"]

        # Verificar subasta activa
        if auction.estado != "active" or auction.fecha_fin < now():
            raise ValidationError("Esta subasta ya no está activa.")

        # Buscar wallet
        try:
            wallet = Wallet.objects.get(usuario=user, periodo=auction.periodo)
        except Wallet.DoesNotExist:
            raise ValidationError("No tienes una billetera activa para este periodo.")

        # Validar saldo suficiente (saldo libre)
        saldo_disponible = wallet.saldo - wallet.bloqueado
        if saldo_disponible < cantidad:
            raise ValidationError("Saldo insuficiente para realizar esta puja.")

        # Guardar la puja
        bid = serializer.save(estudiante=user)

        # Bloquear monedas en la wallet
        wallet.bloqueado += cantidad
        wallet.save()

        return bid