from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Period, Wallet, CoinTransaction
from .serializers import PeriodSerializer, WalletSerializer, CoinTransactionSerializer
from apps.users.permissions import AdminOrDocente


class PeriodViewSet(viewsets.ModelViewSet):
    queryset = Period.objects.all().order_by("-creado")
    serializer_class = PeriodSerializer
    permission_classes = [AdminOrDocente]


class WalletViewSet(viewsets.ModelViewSet):
    queryset = Wallet.objects.all().select_related("usuario", "grupo", "periodo")
    serializer_class = WalletSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == "estudiante":
            return Wallet.objects.filter(usuario=user)
        return super().get_queryset()

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def mi_wallet(self, request):
        """Endpoint para que el estudiante vea su billetera activa"""
        try:
            # Buscar wallet del periodo activo
            wallet = Wallet.objects.filter(
                usuario=request.user,
                periodo__activo=True
            ).select_related("usuario", "grupo", "periodo").first()
            
            if not wallet:
                return Response(
                    {"detail": "No tienes una billetera activa en este momento."},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            serializer = self.get_serializer(wallet)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=["post"], permission_classes=[AdminOrDocente])
    def depositar(self, request, pk=None):
        """Endpoint para que el docente agregue monedas"""
        wallet = self.get_object()
        cantidad = request.data.get("cantidad", 0)
        descripcion = request.data.get("descripcion", "Depósito del docente")
        
        if cantidad <= 0:
            return Response(
                {"detail": "La cantidad debe ser mayor a 0"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        wallet.depositar(cantidad, descripcion)
        serializer = self.get_serializer(wallet)
        return Response(serializer.data)


class CoinTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CoinTransaction.objects.all().select_related("wallet", "wallet__usuario")
    serializer_class = CoinTransactionSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == "estudiante":
            return CoinTransaction.objects.filter(wallet__usuario=user)
        return super().get_queryset()