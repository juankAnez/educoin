from django.db import models
from django.conf import settings
from apps.classrooms.models import Classroom

User = settings.AUTH_USER_MODEL

class Group(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, null=True)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='groups')
    estudiantes = models.ManyToManyField(User, related_name='groups_estudiantes', blank=True)
    creado = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Grupo"
        verbose_name_plural = "Grupos"

    def __str__(self):
        return f"{self.nombre} ({self.classroom.nombre})"
