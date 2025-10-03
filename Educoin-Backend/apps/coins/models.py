from django.db import models
from django.conf import settings
from apps.common.models import BaseModel

User = settings.AUTH_USER_MODEL

class Period(BaseModel):
    nombre = models.CharField(max_length=100)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre


class Wallet(BaseModel):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wallets")
    periodo = models.CharField(max_length=50)
    saldo = models.PositiveIntegerField(default=0)
    bloqueado = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('usuario', 'periodo')

    def __str__(self):
        return f"{self.usuario.email} ({self.periodo}) - Saldo: {self.saldo} | Bloqueado: {self.bloqueado}"


class CoinTransaction(BaseModel):
    TIPOS = [
        ("earn", "Ganado"),
        ("spend", "Gastado"),
        ("reset", "Reinicio"),
    ]

    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name="transacciones")
    tipo = models.CharField(max_length=10, choices=TIPOS)
    cantidad = models.PositiveIntegerField()
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.tipo} {self.cantidad} -> {self.wallet.usuario.email}"
