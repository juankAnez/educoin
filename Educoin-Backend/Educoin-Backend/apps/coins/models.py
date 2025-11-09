from django.db import models
from django.conf import settings
from apps.common.models import BaseModel

User = settings.AUTH_USER_MODEL

class Period(BaseModel):
    grupo = models.ForeignKey("groups.Group", on_delete=models.CASCADE, related_name="periodos")
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    activo = models.BooleanField(default=False)

    def activar(self):
        """Activa este periodo y desactiva los otros del grupo."""
        Period.objects.filter(grupo=self.grupo).update(activo=False)
        self.activo = True
        self.save()

    def esta_activo(self):
        """Verifica si el periodo está dentro de sus fechas y activo."""
        from django.utils import timezone
        hoy = timezone.now().date()
        return self.activo and self.fecha_inicio <= hoy <= self.fecha_fin

    def __str__(self):
        return f"{self.nombre} ({self.grupo.nombre})"



class Wallet(BaseModel):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wallets")
    grupo = models.ForeignKey("groups.Group", on_delete=models.CASCADE, related_name="wallets")
    periodo = models.ForeignKey(Period, on_delete=models.CASCADE, related_name="wallets")

    saldo = models.PositiveIntegerField(default=0)
    bloqueado = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('usuario', 'grupo', 'periodo')

    def __str__(self):
        return f"{self.usuario.email} ({self.grupo.nombre} - {self.periodo.nombre})"

    def depositar(self, cantidad, descripcion=""):
        self.saldo += cantidad
        self.save()
        CoinTransaction.objects.create(wallet=self, tipo="earn", cantidad=cantidad, descripcion=descripcion)

    def gastar(self, cantidad, descripcion=""):
        if cantidad > self.saldo:
            raise ValueError("Fondos insuficientes.")
        self.saldo -= cantidad
        self.save()
        CoinTransaction.objects.create(wallet=self, tipo="spend", cantidad=cantidad, descripcion=descripcion)

    def resetear(self, descripcion="Reinicio de periodo"):
        total = self.saldo
        self.saldo = 0
        self.bloqueado = 0
        self.save()
        CoinTransaction.objects.create(wallet=self, tipo="reset", cantidad=total, descripcion=descripcion)


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
        return f"{self.tipo} {self.cantidad} → {self.wallet.usuario.email}"
