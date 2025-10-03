from django.db import models
from apps.activities.models import Activity
from apps.users.models import User
from apps.common.models import BaseModel

class Grade(BaseModel):
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name='grades')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='grades')
    nota = models.DecimalField(max_digits=4, decimal_places=2)
    retroalimentacion = models.TextField(blank=True)

    class Meta:
        unique_together = ('activity', 'student')

    def __str__(self):
        return f"{self.student.email} - {self.activity.nombre}: {self.nota}"
