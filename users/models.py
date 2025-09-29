from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Administrador'),
        ('docente', 'Docente'),
        ('estudiante', 'Estudiante'),
    ]

    role = models.CharField(
        max_length=12,
        choices=ROLE_CHOICES,
        default='estudiante'
    )
    email = models.EmailField(unique=True)
    # usar email como nombre de usuario
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # username es requerido además de email y password

    def __str__(self):
        return f'{self.email} ({self.get_role_display()})'

class Classroom(models.Model):
    nombre = models.CharField(max_length=100)
    docente = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='clases')
    descripcion = models.TextField(blank=True, null=True)  # ← nuevo
    estudiantes = models.ManyToManyField(
        'users.User',
        related_name='clases_estudiante',
        limit_choices_to={'role': 'estudiante'},
        blank=True  # ← permite lista vacía
    )
    creado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} ({self.docente.email})"

class Activity(models.Model):
    TIPO_CHOICES = [
        ('tarea', 'Tarea'),
        ('examen', 'Examen'),
        ('proyecto', 'Proyecto'),
    ]
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='actividades')
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    valor_educoins = models.PositiveIntegerField(default=0)
    fecha_entrega = models.DateField()
    creado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} - {self.classroom.nombre}"

class CoinTransaction(models.Model):
    estudiante = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='transacciones')
    actividad = models.ForeignKey(Activity, on_delete=models.SET_NULL, null=True, blank=True, related_name='transacciones')
    cantidad = models.IntegerField()
    motivo = models.CharField(max_length=255)
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.estudiante.email} | {self.cantidad} educoins | {self.motivo}"

class Auction(models.Model):
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='subastas')
    docente = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='subastas_creadas')
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    premio = models.CharField(max_length=100)
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField()
    activa = models.BooleanField(default=True)
    ganador = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='subastas_ganadas')

    def __str__(self):
        return f"{self.titulo} ({self.classroom.nombre})"

class Bid(models.Model):
    auction = models.ForeignKey(Auction, on_delete=models.CASCADE, related_name='pujas')
    estudiante = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='pujas')
    cantidad = models.PositiveIntegerField()
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.estudiante.email} - {self.cantidad} educoins"