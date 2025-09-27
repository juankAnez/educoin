from django.db import models
from users.models import User

class Group(models.Model):
    name = models.CharField(max_length=100, help_text="Ej: 10-A Matemáticas")
    teacher = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        limit_choices_to={'role': 'docente'},  # ← corregido a 'docente'
        related_name='teacher_groups'
    )
    max_students = models.PositiveSmallIntegerField(default=30)
    coin_limit = models.PositiveIntegerField(help_text="Total de monedas a repartir en el periodo")
    start_date = models.DateField()
    end_date = models.DateField()
    is_closed = models.BooleanField(default=False, help_text="Se cierra automáticamente al terminar el periodo")

    class Meta:
        ordering = ['-start_date']
        verbose_name = 'Grupo'
        verbose_name_plural = 'Grupos'

    def __str__(self):
        return f"{self.name} ({self.start_date} - {self.end_date})"

class StudentGroup(models.Model):
    student = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        limit_choices_to={'role': 'estudiante'},  # ← corregido a 'estudiante'
        related_name='student_groups'
    )
    group = models.ForeignKey(
        Group,
        on_delete=models.PROTECT,
        related_name='student_groups'
    )
    active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('student', 'group')
        verbose_name = 'Inscripción'
        verbose_name_plural = 'Inscripciones'

    def __str__(self):
        return f"{self.student.email} → {self.group.name}"