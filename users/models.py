from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('docente', 'Docente'),
        ('estudiante', 'Estudiante'),
    ]

    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='student'
    )
    email = models.EmailField(unique=True)
    # usar email como nombre de usuario
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # username es requerido además de email y password

    def __str__(self):
        return f'{self.email} ({self.get_role_display()})'