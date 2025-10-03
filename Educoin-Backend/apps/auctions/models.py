from django.db import models
from django.conf import settings
from apps.coins.models import Period
from apps.common.models import BaseModel

User = settings.AUTH_USER_MODEL

class Auction(BaseModel):
    ESTADOS = [
        ("active", "Activa"),
        ("closed", "Cerrada"),
    ]

    titulo = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, null=True)
    creador = models.ForeignKey(User, on_delete=models.CASCADE, related_name="auctions")
    periodo = models.ForeignKey(Period, on_delete=models.CASCADE, related_name="auctions")
    estado = models.CharField(max_length=10, choices=ESTADOS, default="active")
    fecha_fin = models.DateTimeField()

    def __str__(self):
        return f"Auction {self.titulo} - {self.estado}"


class Bid(BaseModel):
    auction = models.ForeignKey(Auction, on_delete=models.CASCADE, related_name="bids")
    estudiante = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bids")
    cantidad = models.PositiveIntegerField()

    class Meta:
        unique_together = ('auction', 'estudiante')
        ordering = ['-cantidad']

    def __str__(self):
        return f"{self.estudiante.email} -> {self.cantidad} en {self.auction.titulo}"
