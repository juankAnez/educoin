from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from decimal import Decimal
from django.conf import settings
from apps.common.models import BaseModel
from apps.activities.models import Activity
from apps.coins.models import Wallet, Period
from apps.users.models import User


class Grade(BaseModel):
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name='grades')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='grades')
    nota = models.DecimalField(max_digits=5, decimal_places=2)
    retroalimentacion = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('activity', 'student')
        ordering = ['-creado']

    def __str__(self):
        return f"{self.student.email} - {self.activity.nombre}: {self.nota}"

    @property
    def grupo(self):
        return self.activity.group

    @property
    def periodo(self):
        return Period.objects.filter(activo=True).first()

    def calcular_coins_ganados(self):
        return int((Decimal(self.nota) / Decimal(100)) * Decimal(self.activity.valor_educoins))

    def aplicar_recompensa(self):
        periodo_actual = self.periodo
        if not periodo_actual:
            return

        wallet, _ = Wallet.objects.get_or_create(
            usuario=self.student,
            grupo=self.grupo,
            periodo=periodo_actual,
            defaults={'saldo': 0, 'bloqueado': 0},
        )
        coins = self.calcular_coins_ganados()
        if coins > 0:
            wallet.depositar(coins, f"Recompensa por '{self.activity.nombre}' (nota {self.nota})")


@receiver(post_save, sender=Grade)
def asignar_educoins(sender, instance, created, **kwargs):
    if created:
        instance.aplicar_recompensa()
