from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Classroom(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, null=True)
    docente = models.ForeignKey(User, on_delete=models.CASCADE, related_name='classrooms_docente')
    creado = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Clase"
        verbose_name_plural = "Clases"

    def __str__(self):
        return self.nombre
