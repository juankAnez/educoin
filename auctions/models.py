from django.db import models
from users.models import User
from groups.models import Group

class Auction(models.Model):
    REWARD_TYPE_CHOICES = [
        ('grade', 'Mejora de nota'),
        ('benefit', 'Beneficio académico'),
        ('other', 'Otro'),
    ]

    group = models.ForeignKey(
        Group,
        on_delete=models.PROTECT,
        related_name='auctions'
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    reward_type = models.CharField(max_length=10, choices=REWARD_TYPE_CHOICES, default='other')
    min_bid = models.PositiveIntegerField(default=1)
    winner = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'role': 'student'},
        related_name='won_auctions'
    )
    winning_bid = models.PositiveIntegerField(null=True, blank=True)
    is_open = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    closed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Subasta'
        verbose_name_plural = 'Subastas'

    def __str__(self):
        return f"{self.title} ({self.group.name})"

class AuctionBid(models.Model):
    auction = models.ForeignKey(
        Auction,
        on_delete=models.PROTECT,
        related_name='bids'
    )
    student = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        limit_choices_to={'role': 'student'},
        related_name='auction_bids'
    )
    amount = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('auction', 'student')  # solo una oferta por estudiante
        ordering = ['-amount']  # ver primero las ofertas más altas
        verbose_name = 'Oferta de subasta'
        verbose_name_plural = 'Ofertas de subasta'

    def __str__(self):
        return f"{self.student.email} ofrece {self.amount} 🪙 en {self.auction.title}"