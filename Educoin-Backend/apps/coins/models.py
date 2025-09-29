from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Period(models.Model):
    nombre = models.CharField(max_length=100)
    activo = models.BooleanField(default=True)
    creado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre


class Wallet(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wallets")
    periodo = models.CharField(max_length=50)  # ej: "2025-1"
    saldo = models.PositiveIntegerField(default=0)
    bloqueado = models.PositiveIntegerField(default=0)  # coins apartados en subastas
    creado = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("usuario", "periodo")

    def __str__(self):
        return f"{self.usuario.email} ({self.periodo}) - Saldo: {self.saldo} | Bloqueado: {self.bloqueado}"


class CoinTransaction(models.Model):
    TIPOS = [
        ("earn", "Ganado"),
        ("spend", "Gastado"),
        ("reset", "Reinicio"),
    ]

    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name="transacciones")
    tipo = models.CharField(max_length=10, choices=TIPOS)
    cantidad = models.PositiveIntegerField()
    descripcion = models.TextField(blank=True, null=True)
    creado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tipo} {self.cantidad} -> {self.wallet.usuario.email}"
