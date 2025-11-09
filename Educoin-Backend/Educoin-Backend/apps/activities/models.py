from django.db import models
from apps.groups.models import Group
from apps.common.models import BaseModel

class Activity(BaseModel):
    TIPOS = [
        ('tarea', 'Tarea'),
        ('examen', 'Examen'),
        ('proyecto', 'Proyecto'),
        ('quiz', 'Quiz'),
        ('exposicion', 'Exposición'),
    ]

    group = models.ForeignKey("groups.Group", on_delete=models.CASCADE, related_name='activities')
    tipo = models.CharField(max_length=20, choices=TIPOS)
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True)
    valor_educoins = models.PositiveIntegerField(default=100)
    valor_notas = models.PositiveIntegerField(default=100)
    fecha_entrega = models.DateField()
    habilitada = models.BooleanField(default=True)

    class Meta:
        ordering = ['-fecha_entrega']

    def __str__(self):
        return f"{self.nombre} ({self.group.nombre})"

class Submission(BaseModel):
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name='submissions')
    estudiante = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='submissions')
    contenido = models.TextField(blank=True)  # ahora opcional
    archivo = models.FileField(upload_to='submissions/', null=True, blank=True)  # NEW
    calificacion = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    retroalimentacion = models.TextField(blank=True)

    def __str__(self):
        return f"Submission by {self.estudiante.email} for {self.activity.nombre}"

    class Meta:
        unique_together = ('activity', 'estudiante')
        ordering = ['-creado']
        verbose_name = 'Submission'
        verbose_name_plural = 'Submissions'
