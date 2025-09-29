from django.db import models
from apps.classrooms.models import Classroom
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

    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='activities')
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='activities', null=True, blank=True)
    tipo = models.CharField(max_length=20, choices=TIPOS)
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True)
    valor_educoins = models.PositiveIntegerField(default=0)
    valor_notas = models.PositiveIntegerField(default=0)
    fecha_entrega = models.DateField()
    habilitada = models.BooleanField(default=False)  # visible para estudiantes solo si True
    creada = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} - {self.classroom.nombre}"
