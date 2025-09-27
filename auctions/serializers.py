from rest_framework import serializers
from .models import Auction, AuctionBid
from groups.models import Group
from users.models import User

class AuctionSerializer(serializers.ModelSerializer):
    """Serializer para subastas"""
    group_name = serializers.CharField(source='group.name', read_only=True)
    docente_email = serializers.CharField(source='docente.email', read_only=True)
    ganador_email = serializers.CharField(source='ganador.email', read_only=True)

    class Meta:
        model = Auction
        fields = [
            'id', 'group', 'group_name', 'docente', 'docente_email', 'titulo', 'descripcion',
            'premio', 'fecha_inicio', 'fecha_fin', 'activa', 'ganador', 'ganador_email'
        ]
        read_only_fields = ['id', 'group_name', 'docente_email', 'ganador_email']

class AuctionBidSerializer(serializers.ModelSerializer):
    """Serializer para pujas de subasta"""
    auction_title = serializers.CharField(source='auction.titulo', read_only=True)
    estudiante_email = serializers.CharField(source='estudiante.email', read_only=True)

    class Meta:
        model = AuctionBid
        fields = [
            'id', 'auction', 'auction_title', 'estudiante', 'estudiante_email',
            'cantidad', 'fecha'
        ]
        read_only_fields = ['id', 'auction_title', 'estudiante_email', 'fecha']

class CreateAuctionSerializer(serializers.Serializer):
    """Serializer para crear subastas"""
    title = serializers.CharField(max_length=200)
    description = serializers.CharField()
    starting_bid = serializers.IntegerField(min_value=1, max_value=1000)
    group_id = serializers.IntegerField()
    
    def validate_group_id(self, value):
        """Validar que el grupo exista y pertenezca al profesor"""
        request = self.context.get('request')
        try:
            group = Group.objects.get(id=value, teacher=request.user)
            return value
        except Group.DoesNotExist:
            raise serializers.ValidationError("Grupo no encontrado o no autorizado")

class PlaceBidSerializer(serializers.Serializer):
    """Serializer para realizar pujas"""
    auction_id = serializers.IntegerField()
    amount = serializers.IntegerField(min_value=1)
    
    def validate_auction_id(self, value):
        """Validar que la subasta exista y esté activa"""
        try:
            auction = Auction.objects.get(id=value, status='active')
            return value
        except Auction.DoesNotExist:
            raise serializers.ValidationError("Subasta no encontrada o no activa")
    
    def validate(self, data):
        """Validaciones adicionales para la puja"""
        request = self.context.get('request')
        auction = Auction.objects.get(id=data['auction_id'])
        amount = data['amount']
        
        # Verificar que el estudiante esté en el grupo
        from groups.models import StudentGroup
        if not StudentGroup.objects.filter(student=request.user, group=auction.group).exists():
            raise serializers.ValidationError("No perteneces a este grupo")
        
        # Verificar que la puja sea mayor a la actual más alta
        current_highest = auction.auctionbid_set.order_by('-amount').first()
        min_bid = current_highest.amount + 1 if current_highest else auction.starting_bid
        
        if amount < min_bid:
            raise serializers.ValidationError(f"La puja debe ser al menos {min_bid} Educoins")
        
        # Verificar que el estudiante tenga suficientes Educoins
        from coins.models import EducoinWallet
        try:
            wallet = EducoinWallet.objects.get(student=request.user, group=auction.group)
            if wallet.balance < amount:
                raise serializers.ValidationError("No tienes suficientes Educoins")
        except EducoinWallet.DoesNotExist:
            raise serializers.ValidationError("No tienes una billetera en este grupo")
        
        return data