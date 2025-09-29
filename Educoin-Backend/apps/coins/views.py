from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Period, Wallet, CoinTransaction
from .serializers import PeriodSerializer, WalletSerializer, CoinTransactionSerializer
from apps.users.permissions import AdminOrDocente


class PeriodViewSet(viewsets.ModelViewSet):
    queryset = Period.objects.all()
    serializer_class = PeriodSerializer
    permission_classes = [AdminOrDocente]


class WalletViewSet(viewsets.ModelViewSet):
    queryset = Wallet.objects.all()
    serializer_class = WalletSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "estudiante":
            # solo ve sus propias wallets
            return Wallet.objects.filter(usuario=user)
        return Wallet.objects.all()


class CoinTransactionViewSet(viewsets.ModelViewSet):
    queryset = CoinTransaction.objects.all().order_by("-creado")
    serializer_class = CoinTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "estudiante":
            # solo puede ver transacciones de sus propias wallets
            return CoinTransaction.objects.filter(wallet__usuario=user)
        return CoinTransaction.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        tipo = serializer.validated_data.get("tipo")

        # solo admin/docente pueden dar monedas (earn)
        if tipo == "earn" and user.role not in ["admin", "docente"]:
            raise PermissionDenied("Solo los docentes o administradores pueden asignar monedas.")

        # todos pueden registrar gastos, pero OJO: aquí normalmente se hace desde lógica interna (ej. pujas)
        if tipo == "spend" and user.role == "estudiante":
            raise PermissionDenied("Las transacciones de gasto se generan automáticamente, no manualmente.")

        return serializer.save()
