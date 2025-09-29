from rest_framework import serializers
from .models import Period, Wallet, CoinTransaction


class PeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Period
        fields = ["id", "nombre", "activo", "creado"]


class WalletSerializer(serializers.ModelSerializer):
    usuario_email = serializers.EmailField(source="usuario.email", read_only=True)

    class Meta:
        model = Wallet
        fields = ["id", "usuario", "usuario_email", "periodo", "saldo", "bloqueado", "creado"]
        read_only_fields = ["saldo", "bloqueado", "creado"]


class CoinTransactionSerializer(serializers.ModelSerializer):
    wallet_usuario_email = serializers.EmailField(source="wallet.usuario.email", read_only=True)

    class Meta:
        model = CoinTransaction
        fields = ["id", "wallet", "wallet_usuario_email", "tipo", "cantidad", "descripcion", "creado"]
        read_only_fields = ["creado"]
