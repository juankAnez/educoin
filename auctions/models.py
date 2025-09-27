from django.db import models
from users.models import User
from groups.models import Group

class Auction(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='auctions')
    docente = models.ForeignKey(User, on_delete=models.CASCADE, related_name='auctions')
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    premio = models.CharField(max_length=100)
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField()
    activa = models.BooleanField(default=True)
    ganador = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='auctions_ganadas')

    def __str__(self):
        return f"{self.titulo} ({self.group.name})"

class AuctionBid(models.Model):
    auction = models.ForeignKey(Auction, on_delete=models.CASCADE, related_name='bids')
    estudiante = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bids')
    cantidad = models.PositiveIntegerField()
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.estudiante.email} - {self.cantidad} educoins"