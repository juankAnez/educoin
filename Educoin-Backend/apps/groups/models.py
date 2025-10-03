from django.db import models
from django.utils import timezone
from django.utils.crypto import get_random_string
from apps.classrooms.models import Classroom
from apps.users.models import User
from apps.common.models import BaseModel

def generate_group_code(length=6):
    alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    return get_random_string(length=length, allowed_chars=alphabet)

class Group(BaseModel):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name="grupos_clases")

    codigo = models.CharField(max_length=10, unique=True, blank=True, null=True)
    codigo_generado_en = models.DateTimeField(null=True, blank=True)
    codigo_expira_en = models.DateTimeField(null=True, blank=True)

    estudiantes = models.ManyToManyField(
        User,
        related_name="grupos_estudiante",
        blank=True,
        limit_choices_to={'role': 'estudiante'}
    )

    activo = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Group'
        verbose_name_plural = 'Groups'
        ordering = ['nombre']

    def save(self, *args, **kwargs):
        if not self.codigo:
            for _ in range(5):
                code = generate_group_code(6)
                if not Group.objects.filter(codigo=code).exists():
                    self.codigo = code
                    self.codigo_generado_en = timezone.now()
                    break
        super().save(*args, **kwargs)

    def codigo_valido(self):
        if not self.codigo:
            return False
        if self.codigo_expira_en:
            return timezone.now() <= self.codigo_expira_en
        return True

    def __str__(self):
        return f"{self.nombre} ({self.classroom})"
