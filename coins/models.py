from django.db import models
from users.models import User

class EducoinWallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wallet')
    balance = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.email} - {self.balance} educoins"

class EducoinTransaction(models.Model):
    wallet = models.ForeignKey(EducoinWallet, on_delete=models.CASCADE, related_name='transactions')
    amount = models.IntegerField()
    reason = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    # Opcional: quién realizó la transacción (docente/admin)
    performed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='performed_transactions')

    def __str__(self):
        return f"{self.wallet.user.email} | {self.amount} | {self.reason} | {self.created_at}"