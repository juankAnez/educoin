from django.db import models
from apps.activities.models import Activity
from apps.users.models import User

class Grade(models.Model):
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name='grades')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='grades')
    nota = models.DecimalField(max_digits=4, decimal_places=2)  # ej 0-5 o 0-10
    retroalimentacion = models.TextField(blank=True)
    fecha = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('activity', 'student')

    def __str__(self):
        return f"{self.student.email} - {self.activity.nombre}: {self.nota}"
