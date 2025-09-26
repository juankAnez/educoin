from django.db import models
from users.models import User
from groups.models import Group

class EducoinWallet(models.Model):
    student = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        limit_choices_to={'role': 'student'},
        related_name='wallets'
    )
    group = models.ForeignKey(
        Group,
        on_delete=models.PROTECT,
        related_name='wallets'
    )
    balance = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'group')  # solo una billetera por grupo
        verbose_name = 'Billetera Educoin'
        verbose_name_plural = 'Billeteras Educoin'

    def __str__(self):
        return f"{self.student.email} → {self.group.name} | {self.balance} 🪙"


class EducoinTransaction(models.Model):
    TASK_TYPE_CHOICES = [
        ('on_time', 'Tarea a tiempo'),
        ('late', 'Tarea tardía'),
        ('auction', 'Subasta'),
        ('reward', 'Recompensa'),
        ('other', 'Otro'),
    ]

    wallet = models.ForeignKey(
        EducoinWallet,
        on_delete=models.PROTECT,
        related_name='transactions'
    )
    amount = models.IntegerField()  # positivo = ingreso, negativo = egreso
    reason = models.CharField(max_length=255)
    task_type = models.CharField(max_length=10, choices=TASK_TYPE_CHOICES, default='other')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Transacción'
        verbose_name_plural = 'Transacciones'

    def __str__(self):
        return f"{self.wallet.student.email} | {self.amount:+} | {self.reason}"