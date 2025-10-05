from rest_framework import serializers
from .models import Period, Wallet, CoinTransaction


class PeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Period
        fields = "__all__"


class CoinTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoinTransaction
        fields = "__all__"
        read_only_fields = ["wallet", "tipo"]


class WalletSerializer(serializers.ModelSerializer):
    transacciones = CoinTransactionSerializer(many=True, read_only=True)
    usuario_email = serializers.EmailField(source="usuario.email", read_only=True)
    grupo_nombre = serializers.CharField(source="grupo.nombre", read_only=True)
    periodo_nombre = serializers.CharField(source="periodo.nombre", read_only=True)

    class Meta:
        model = Wallet
        fields = [
            "id", "usuario", "usuario_email", "grupo", "grupo_nombre",
            "periodo", "periodo_nombre", "saldo", "bloqueado", "transacciones"
        ]
