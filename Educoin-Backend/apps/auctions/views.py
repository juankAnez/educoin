from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError, PermissionDenied
from django.utils.timezone import now
from django.db import transaction
from .models import Auction, Bid
from .serializers import (
    AuctionSerializer, 
    AuctionUpdateSerializer,
    BidSerializer, 
    BidCreateSerializer
)
from apps.users.permissions import AdminOrDocente, IsDocente
from apps.coins.models import Wallet, Period


class AuctionViewSet(viewsets.ModelViewSet):
    """
    CRUD completo de subastas:
    - Docentes: Pueden crear, ver, editar y eliminar sus subastas
    - Estudiantes: Solo pueden ver las subastas de sus grupos
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return AuctionUpdateSerializer
        return AuctionSerializer

    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'docente':
            # Docente ve subastas de sus grupos
            return Auction.objects.filter(
                grupo__classroom__docente=user
            ).select_related('creador', 'grupo', 'grupo__classroom').prefetch_related('bids')
        
        elif user.role == 'estudiante':
            # Estudiante ve subastas de los grupos a los que pertenece
            return Auction.objects.filter(
                grupo__estudiantes=user
            ).select_related('creador', 'grupo', 'grupo__classroom').prefetch_related('bids')
        
        elif user.role == 'admin' or user.is_staff:
            return Auction.objects.all().select_related('creador', 'grupo').prefetch_related('bids')
        
        return Auction.objects.none()

    def get_permissions(self):
        """
        - CREATE, UPDATE, DELETE: Solo docentes y admin
        - LIST, RETRIEVE: Docentes, estudiantes (solo sus grupos)
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, AdminOrDocente]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        """Al crear, asignar el docente como creador"""
        serializer.save(creador=self.request.user)

    def perform_update(self, serializer):
        """Validar que el docente solo pueda editar sus propias subastas"""
        auction = self.get_object()
        user = self.request.user
        
        if user.role == 'docente' and auction.creador != user:
            raise PermissionDenied("No puedes editar subastas de otros docentes.")
        
        serializer.save()

    def perform_destroy(self, instance):
        """Validar que el docente solo pueda eliminar sus propias subastas"""
        user = self.request.user
        
        if user.role == 'docente' and instance.creador != user:
            raise PermissionDenied("No puedes eliminar subastas de otros docentes.")
        
        if instance.estado == 'closed':
            raise ValidationError("No se puede eliminar una subasta cerrada.")
        
        # Devolver monedas bloqueadas antes de eliminar
        for bid in instance.bids.all():
            try:
                periodo_activo = Period.objects.filter(grupo=instance.grupo, activo=True).first()
                if periodo_activo:
                    wallet = Wallet.objects.get(
                        usuario=bid.estudiante, 
                        grupo=instance.grupo, 
                        periodo=periodo_activo
                    )
                    wallet.bloqueado -= bid.cantidad
                    wallet.save()
            except Wallet.DoesNotExist:
                pass
        
        instance.delete()

    @action(detail=True, methods=["post"], permission_classes=[AdminOrDocente])
    @transaction.atomic
    def close(self, request, pk=None):
        """
        Cerrar la subasta y procesar el ganador.
        Solo el docente creador o admin puede cerrar.
        """
        auction = self.get_object()
        user = request.user

        # Validar permisos
        if user.role == 'docente' and auction.creador != user:
            raise PermissionDenied("Solo el creador de la subasta puede cerrarla.")

        if auction.estado != "active":
            return Response(
                {"detail": "La subasta ya está cerrada."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Marcar como cerrada
        auction.estado = "closed"
        auction.save()

        # Obtener la puja más alta
        highest_bid = auction.bids.order_by("-cantidad").first()

        if not highest_bid:
            return Response({
                "detail": "Subasta cerrada sin pujas."
            }, status=status.HTTP_200_OK)

        ganador = highest_bid.estudiante
        monto = highest_bid.cantidad

        # Obtener periodo activo
        periodo_activo = Period.objects.filter(grupo=auction.grupo, activo=True).first()
        
        if not periodo_activo:
            return Response({
                "detail": "No hay periodo activo para procesar el pago."
            }, status=status.HTTP_400_BAD_REQUEST)

        # 1. Cobrar coins al ganador
        try:
            wallet_ganador = Wallet.objects.get(
                usuario=ganador, 
                grupo=auction.grupo, 
                periodo=periodo_activo
            )
            wallet_ganador.bloqueado -= monto
            wallet_ganador.saldo -= monto
            wallet_ganador.save()

            # Registrar transacción
            from apps.coins.models import CoinTransaction
            CoinTransaction.objects.create(
                wallet=wallet_ganador,
                tipo="spend",
                cantidad=monto,
                descripcion=f"Pago por ganar subasta: {auction.titulo}"
            )
        except Wallet.DoesNotExist:
            return Response({
                "detail": "Error: El ganador no tiene billetera activa."
            }, status=status.HTTP_400_BAD_REQUEST)

        # 2. Devolver coins a los demás participantes
        otras_pujas = auction.bids.exclude(id=highest_bid.id)
        for bid in otras_pujas:
            try:
                wallet = Wallet.objects.get(
                    usuario=bid.estudiante, 
                    grupo=auction.grupo, 
                    periodo=periodo_activo
                )
                wallet.bloqueado -= bid.cantidad
                wallet.save()
            except Wallet.DoesNotExist:
                pass

        return Response({
            "detail": f"Subasta cerrada exitosamente",
            "ganador": {
                "id": ganador.id,
                "email": ganador.email,
                "nombre": f"{ganador.first_name} {ganador.last_name}".strip(),
                "monto_pagado": monto
            },
            "total_participantes": auction.bids.count()
        }, status=status.HTTP_200_OK)


class BidViewSet(viewsets.ModelViewSet):
    """
    Gestión de pujas:
    - Estudiantes: Pueden crear su propia puja y verla
    - Docentes: Pueden crear pujas para sus estudiantes y ver todas las pujas
    """
    serializer_class = BidSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'docente':
            # Docente ve todas las pujas de subastas de sus grupos
            return Bid.objects.filter(
                auction__grupo__classroom__docente=user
            ).select_related('auction', 'estudiante', 'registrado_por')
        
        elif user.role == 'estudiante':
            # Estudiante solo ve sus propias pujas
            return Bid.objects.filter(
                estudiante=user
            ).select_related('auction', 'estudiante', 'registrado_por')
        
        elif user.role == 'admin' or user.is_staff:
            return Bid.objects.all().select_related('auction', 'estudiante', 'registrado_por')
        
        return Bid.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return BidCreateSerializer
        return BidSerializer

    @transaction.atomic
    def perform_create(self, serializer):
        """
        Crear puja:
        - Si es estudiante: crea su propia puja
        - Si es docente: crea la puja para un estudiante específico
        """
        user = self.request.user
        auction = serializer.validated_data['auction']
        estudiante = serializer.validated_data['estudiante']
        cantidad = serializer.validated_data['cantidad']

        # Validar permisos según rol
        if user.role == 'estudiante':
            # El estudiante solo puede pujar por sí mismo
            if estudiante != user:
                raise PermissionDenied("Solo puedes crear pujas para ti mismo.")
        
        elif user.role == 'docente':
            # El docente debe ser del grupo de la subasta
            if auction.grupo.classroom.docente != user:
                raise PermissionDenied("No puedes crear pujas en subastas de otros grupos.")
        
        else:
            raise PermissionDenied("No tienes permiso para crear pujas.")

        # Validar que la subasta esté activa
        if auction.estado != "active" or auction.fecha_fin < now():
            raise ValidationError("Esta subasta ya no está activa.")

        # Buscar wallet y periodo activo
        periodo_activo = Period.objects.filter(grupo=auction.grupo, activo=True).first()
        
        if not periodo_activo:
            raise ValidationError("No hay un periodo activo para este grupo.")

        try:
            wallet = Wallet.objects.get(
                usuario=estudiante, 
                grupo=auction.grupo, 
                periodo=periodo_activo
            )
        except Wallet.DoesNotExist:
            raise ValidationError("El estudiante no tiene una billetera activa en este grupo.")

        # Validar saldo suficiente (saldo libre)
        saldo_disponible = wallet.saldo - wallet.bloqueado
        if saldo_disponible < cantidad:
            raise ValidationError(
                f"Saldo insuficiente. Disponible: {saldo_disponible}, Solicitado: {cantidad}"
            )

        # Guardar la puja con registro de quién la creó
        bid = serializer.save(registrado_por=user)

        # Bloquear monedas en la wallet
        wallet.bloqueado += cantidad
        wallet.save()

    def perform_update(self, serializer):
        """Actualizar puja - Solo docentes pueden modificar pujas"""
        user = self.request.user
        bid = self.get_object()
        
        if user.role != 'docente':
            raise PermissionDenied("Solo los docentes pueden modificar pujas.")
        
        if bid.auction.grupo.classroom.docente != user:
            raise PermissionDenied("No puedes modificar pujas de otros grupos.")
        
        if bid.auction.estado != 'active':
            raise ValidationError("No se pueden modificar pujas de subastas cerradas.")
        
        # Ajustar saldo bloqueado si cambia la cantidad
        old_cantidad = bid.cantidad
        new_cantidad = serializer.validated_data.get('cantidad', old_cantidad)
        
        if old_cantidad != new_cantidad:
            periodo_activo = Period.objects.filter(grupo=bid.auction.grupo, activo=True).first()
            wallet = Wallet.objects.get(
                usuario=bid.estudiante,
                grupo=bid.auction.grupo,
                periodo=periodo_activo
            )
            
            diferencia = new_cantidad - old_cantidad
            saldo_disponible = wallet.saldo - wallet.bloqueado
            
            if diferencia > saldo_disponible:
                raise ValidationError(
                    f"Saldo insuficiente para aumentar la puja. Disponible: {saldo_disponible}"
                )
            
            wallet.bloqueado += diferencia
            wallet.save()
        
        serializer.save()

    def perform_destroy(self, instance):
        """Eliminar puja - Solo docentes y antes de cerrar la subasta"""
        user = self.request.user
        
        if user.role == 'estudiante':
            raise PermissionDenied("Los estudiantes no pueden eliminar pujas.")
        
        if user.role == 'docente' and instance.auction.grupo.classroom.docente != user:
            raise PermissionDenied("No puedes eliminar pujas de otros grupos.")
        
        if instance.auction.estado != 'active':
            raise ValidationError("No se pueden eliminar pujas de subastas cerradas.")
        
        # Desbloquear monedas
        try:
            periodo_activo = Period.objects.filter(grupo=instance.auction.grupo, activo=True).first()
            if periodo_activo:
                wallet = Wallet.objects.get(
                    usuario=instance.estudiante,
                    grupo=instance.auction.grupo,
                    periodo=periodo_activo
                )
                wallet.bloqueado -= instance.cantidad
                wallet.save()
        except Wallet.DoesNotExist:
            pass
        
        instance.delete()

    @action(detail=False, methods=['get'], url_path='por-subasta/(?P<auction_id>[^/.]+)')
    def by_auction(self, request, auction_id=None):
        """
        Obtener todas las pujas de una subasta específica.
        Docentes ven todas, estudiantes solo la suya.
        """
        user = request.user
        
        try:
            auction = Auction.objects.get(pk=auction_id)
        except Auction.DoesNotExist:
            return Response(
                {"detail": "Subasta no encontrada."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if user.role == 'docente':
            if auction.grupo.classroom.docente != user:
                raise PermissionDenied("No tienes acceso a esta subasta.")
            bids = auction.bids.all().order_by('-cantidad')
        
        elif user.role == 'estudiante':
            if not auction.grupo.estudiantes.filter(id=user.id).exists():
                raise PermissionDenied("No tienes acceso a esta subasta.")
            bids = auction.bids.filter(estudiante=user)
        
        else:
            bids = auction.bids.all()
        
        serializer = self.get_serializer(bids, many=True)
        return Response(serializer.data)