from django.db import models
from apps.groups.models import Group

class Activity(models.Model):
    TIPOS = [
        ('tarea', 'Tarea'),
        ('examen', 'Examen'),
        ('parcial', 'Parcial'),
        ('proyecto', 'Proyecto'),
        ('quiz', 'Quiz'),
        ('exposicion', 'Exposición'),
    ]

    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='activities')
    tipo = models.CharField(max_length=20, choices=TIPOS)
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True)
    valor_educoins = models.PositiveIntegerField(default=0)
    valor_notas = models.PositiveIntegerField(default=0)
    fecha_entrega = models.DateField()
    habilitada = models.BooleanField(default=False)
    creada = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} - {self.group.nombre}"

    class Meta:
        ordering = ['-creada']
        verbose_name = 'Actividad'
        verbose_name_plural = 'Actividades'
        
class Submission(models.Model):
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name='submissions')
    estudiante = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='submissions')
    contenido = models.TextField()
    fecha_envio = models.DateTimeField(auto_now_add=True)
    calificacion = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    retroalimentacion = models.TextField(blank=True)

    def __str__(self):
        return f"Submission by {self.estudiante.username} for {self.activity.nombre}"

    class Meta:
        unique_together = ('activity', 'estudiante')
        ordering = ['-fecha_envio']
        verbose_name = 'Submission'
        verbose_name_plural = 'Submissions'
