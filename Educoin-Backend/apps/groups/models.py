from django.db import models
from django.utils import timezone
from django.utils.crypto import get_random_string
from apps.classrooms.models import Classroom
from apps.users.models import User

def generate_group_code(length=6):
    # Letras mayúsculas y números, evita confusiones visuales si quieres
    alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    return get_random_string(length=length, allowed_chars=alphabet)

class Group(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name="grupos_clases")
    creado = models.DateTimeField(auto_now_add=True)

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
        ordering = ['-creado']
        verbose_name = "Grupo"
        verbose_name_plural = "Grupos"

    def save(self, *args, **kwargs):
        # Generar código único si no existe
        if not self.codigo:
            # Intentar hasta 5 veces (evitar rare collisions)
            for _ in range(5):
                code = generate_group_code(6)
                if not Group.objects.filter(codigo=code).exists():
                    self.codigo = code
                    self.codigo_generado_en = timezone.now()
                    break
        super().save(*args, **kwargs)

    def codigo_valido(self):
        """Comprueba expiración si existe"""
        if not self.codigo:
            return False
        if self.codigo_expira_en:
            return timezone.now() <= self.codigo_expira_en
        return True

    def __str__(self):
        return f"{self.nombre} ({self.classroom})"
