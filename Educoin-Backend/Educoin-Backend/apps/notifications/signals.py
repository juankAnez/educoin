from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.grades.models import Grade
from apps.auctions.models import Auction
from apps.coins.models import CoinTransaction
from .models import Notification


@receiver(post_save, sender=Grade)
def notificar_calificacion(sender, instance, created, **kwargs):
    """Notificar al estudiante cuando recibe una calificación"""
    if created:
        Notification.objects.create(
            usuario=instance.student,
            tipo='calificacion',
            titulo='Nueva calificación recibida',
            mensaje=f'Has recibido una calificación de {instance.nota} en "{instance.activity.nombre}"',
            grade_id=instance.id,
            metadata={
                'nota': str(instance.nota),
                'activity_nombre': instance.activity.nombre,
                'educoins_ganados': instance.calcular_coins_ganados()
            }
        )


@receiver(post_save, sender=Auction)
def notificar_nueva_subasta(sender, instance, created, **kwargs):
    """Notificar a los estudiantes del grupo cuando hay una nueva subasta"""
    if created and instance.estado == 'active':
        # Obtener estudiantes del grupo a través del periodo
        try:
            grupo = instance.periodo.grupo
            estudiantes = grupo.estudiantes.all()
            
            notificaciones = [
                Notification(
                    usuario=estudiante,
                    tipo='subasta_nueva',
                    titulo='Nueva subasta disponible',
                    mensaje=f'Nueva subasta: "{instance.titulo}" - ¡Participa ahora!',
                    auction_id=instance.id,
                    metadata={
                        'auction_titulo': instance.titulo,
                        'fecha_fin': instance.fecha_fin.isoformat()
                    }
                )
                for estudiante in estudiantes
            ]
            
            if notificaciones:
                Notification.objects.bulk_create(notificaciones)
        except Exception as e:
            # Log el error pero no romper la creación de la subasta
            print(f"Error creando notificaciones de subasta: {e}")

@receiver(post_save, sender=CoinTransaction)
def notificar_monedas_recibidas(sender, instance, created, **kwargs):
    """Notificar cuando un estudiante recibe monedas"""
    if created and instance.tipo == 'earn':
        Notification.objects.create(
            usuario=instance.wallet.usuario,
            tipo='monedas',
            titulo='Monedas recibidas',
            mensaje=f'Has recibido {instance.cantidad} educoins. {instance.descripcion}',
            metadata={
                'cantidad': instance.cantidad,
                'saldo_nuevo': instance.wallet.saldo
            }
        )