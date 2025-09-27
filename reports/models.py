from django.db import models
from users.models import User

class Report(models.Model):
    REPORT_TYPE_CHOICES = [
        ('desempeño', 'Desempeño'),
        ('monedas', 'Movimientos de Educoins'),
        ('participación', 'Participación'),
    ]
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='reports')
    report_type = models.CharField(max_length=30, choices=REPORT_TYPE_CHOICES)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to='reports/', null=True, blank=True)  # Para exportar PDF/Excel

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_report_type_display()} - {self.created_at.date()}"
