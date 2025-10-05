from rest_framework import viewsets, permissions
from .models import Period, Wallet, CoinTransaction
from .serializers import PeriodSerializer, WalletSerializer, CoinTransactionSerializer


class PeriodViewSet(viewsets.ModelViewSet):
    queryset = Period.objects.all().order_by("-creado")
    serializer_class = PeriodSerializer
    permission_classes = [permissions.IsAdminUser]


class WalletViewSet(viewsets.ModelViewSet):
    queryset = Wallet.objects.all().select_related("usuario", "grupo", "periodo")
    serializer_class = WalletSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == "estudiante":
            return Wallet.objects.filter(usuario=user)
        return super().get_queryset()


class CoinTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CoinTransaction.objects.all().select_related("wallet", "wallet__usuario")
    serializer_class = CoinTransactionSerializer
