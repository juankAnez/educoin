from rest_framework import serializers
from .models import Auction, AuctionBid
from groups.models import Group
from users.models import User

class AuctionSerializer(serializers.ModelSerializer):
    """Serializer para subastas"""
    group_name = serializers.CharField(source='group.name', read_only=True)
    winner_name = serializers.CharField(source='winner.get_full_name', read_only=True)
    current_highest_bid = serializers.SerializerMethodField()
    total_bids = serializers.SerializerMethodField()
    time_left = serializers.SerializerMethodField()
    
    class Meta:
        model = Auction
        fields = ['id', 'title', 'description', 'starting_bid', 'group', 'group_name',
                 'winner', 'winner_name', 'status', 'current_highest_bid', 'total_bids',
                 'time_left', 'created_at', 'updated_at']
        read_only_fields = ['id', 'winner', 'status', 'created_at', 'updated_at']
    
    def get_current_highest_bid(self, obj):
        """Obtener la puja más alta actual"""
        highest_bid = obj.auctionbid_set.order_by('-amount').first()
        return highest_bid.amount if highest_bid else obj.starting_bid
    
    def get_total_bids(self, obj):
        """Contar total de pujas"""
        return obj.auctionbid_set.count()
    
    def get_time_left(self, obj):
        """Calcular tiempo restante (placeholder - puedes agregar fecha límite al modelo)"""
        if obj.status == 'closed':
            return "Subasta cerrada"
        elif obj.status == 'active':
            return "Activa"
        else:
            return "Pendiente"

class AuctionBidSerializer(serializers.ModelSerializer):
    """Serializer para pujas de subasta"""
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    student_email = serializers.CharField(source='student.email', read_only=True)
    auction_title = serializers.CharField(source='auction.title', read_only=True)
    
    class Meta:
        model = AuctionBid
        fields = ['id', 'auction', 'student', 'amount', 'student_name', 
                 'student_email', 'auction_title', 'created_at']
        read_only_fields = ['id', 'student', 'created_at']

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