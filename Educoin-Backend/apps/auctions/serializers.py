# apps/auctions/serializers.py
from rest_framework import serializers
from .models import Auction, Bid
from apps.groups.models import Group


class BidSerializer(serializers.ModelSerializer):
    estudiante_email = serializers.EmailField(source="estudiante.email", read_only=True)
    estudiante_nombre = serializers.SerializerMethodField()
    auction_titulo = serializers.CharField(source="auction.titulo", read_only=True)
    registrado_por_email = serializers.EmailField(source="registrado_por.email", read_only=True)

    class Meta:
        model = Bid
        fields = [
            "id",
            "auction",
            "auction_titulo",
            "estudiante",
            "estudiante_email",
            "estudiante_nombre",
            "cantidad",
            "registrado_por",
            "registrado_por_email",
            "creado",
        ]
        read_only_fields = ["id", "creado"]

    def get_estudiante_nombre(self, obj):
        return f"{obj.estudiante.first_name} {obj.estudiante.last_name}".strip()


class BidCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear pujas (usado por docentes y estudiantes)"""
    
    class Meta:
        model = Bid
        fields = ["auction", "estudiante", "cantidad"]

    def validate(self, data):
        auction = data.get('auction')
        estudiante = data.get('estudiante')
        request = self.context.get('request')

        # Validar que la subasta esté activa
        if auction.estado != "active":
            raise serializers.ValidationError("Esta subasta ya no está activa.")

        # Validar que el estudiante pertenezca al grupo de la subasta
        if not auction.grupo.estudiantes.filter(id=estudiante.id).exists():
            raise serializers.ValidationError(
                f"El estudiante {estudiante.email} no pertenece al grupo de esta subasta."
            )

        # Validar que no exista una puja previa para este estudiante en esta subasta
        if Bid.objects.filter(auction=auction, estudiante=estudiante).exists():
            raise serializers.ValidationError(
                f"El estudiante {estudiante.email} ya tiene una puja registrada en esta subasta."
            )

        # Validar saldo disponible del estudiante
        from apps.coins.models import Wallet, Period
        
        periodo_activo = Period.objects.filter(grupo=auction.grupo, activo=True).first()
        if not periodo_activo:
            raise serializers.ValidationError("No hay un periodo activo para este grupo.")

        try:
            wallet = Wallet.objects.get(usuario=estudiante, grupo=auction.grupo, periodo=periodo_activo)
        except Wallet.DoesNotExist:
            raise serializers.ValidationError(
                f"El estudiante {estudiante.email} no tiene una billetera activa en este grupo."
            )

        saldo_disponible = wallet.saldo - wallet.bloqueado
        if saldo_disponible < data.get('cantidad'):
            raise serializers.ValidationError(
                f"El estudiante {estudiante.email} no tiene suficiente saldo. "
                f"Disponible: {saldo_disponible}, Solicitado: {data.get('cantidad')}"
            )

        return data


class AuctionSerializer(serializers.ModelSerializer):
    creador_email = serializers.EmailField(source="creador.email", read_only=True)
    creador_nombre = serializers.SerializerMethodField()
    grupo_nombre = serializers.CharField(source="grupo.nombre", read_only=True)
    total_pujas = serializers.SerializerMethodField()
    bids = serializers.SerializerMethodField()
    puja_ganadora = serializers.SerializerMethodField()

    class Meta:
        model = Auction
        fields = [
            "id",
            "titulo",
            "descripcion",
            "creador",
            "creador_email",
            "creador_nombre",
            "grupo",
            "grupo_nombre",
            "fecha_fin",
            "estado",
            "total_pujas",
            "puja_ganadora",
            "bids",
            "creado",
        ]
        read_only_fields = ["id", "creador", "creado", "estado"]

    def get_creador_nombre(self, obj):
        return f"{obj.creador.first_name} {obj.creador.last_name}".strip()

    def get_total_pujas(self, obj):
        return obj.bids.count()

    def get_puja_ganadora(self, obj):
        """Retorna la puja más alta si la subasta está cerrada"""
        if obj.estado == "closed":
            highest_bid = obj.bids.order_by("-cantidad").first()
            if highest_bid:
                return {
                    "estudiante_id": highest_bid.estudiante.id,
                    "estudiante_nombre": f"{highest_bid.estudiante.first_name} {highest_bid.estudiante.last_name}".strip(),
                    "cantidad": highest_bid.cantidad
                }
        return None

    def get_bids(self, obj):
        """Mostrar pujas según el rol del usuario"""
        request = self.context.get('request')
        if not request:
            return []

        user = request.user

        # Si es docente del grupo, mostrar todas las pujas
        if user.role == 'docente' and obj.grupo.classroom.docente == user:
            bids = obj.bids.all().order_by('-cantidad')
            return BidSerializer(bids, many=True).data
        
        # Si es estudiante, solo mostrar su propia puja
        elif user.role == 'estudiante':
            bid = obj.bids.filter(estudiante=user).first()
            if bid:
                return [BidSerializer(bid).data]
        
        return []

    def validate_grupo(self, value):
        """Validar que el docente solo pueda crear subastas en sus grupos"""
        request = self.context.get('request')
        if request and request.user.role == 'docente':
            if value.classroom.docente != request.user:
                raise serializers.ValidationError(
                    "No puedes crear subastas en grupos que no son tuyos."
                )
        return value


class AuctionUpdateSerializer(serializers.ModelSerializer):
    """Serializer específico para actualizar subastas"""
    
    class Meta:
        model = Auction
        fields = ["titulo", "descripcion", "grupo", "fecha_fin"]

    def validate_grupo(self, value):
        """Validar que el docente solo pueda asignar a sus grupos"""
        request = self.context.get('request')
        if request and request.user.role == 'docente':
            if value.classroom.docente != request.user:
                raise serializers.ValidationError(
                    "No puedes asignar la subasta a un grupo que no es tuyo."
                )
        return value

    def validate(self, data):
        """Validar que no se pueda cambiar si la subasta está cerrada"""
        instance = self.instance
        if instance and instance.estado == 'closed':
            raise serializers.ValidationError(
                "No se puede modificar una subasta que ya está cerrada."
            )
        return data