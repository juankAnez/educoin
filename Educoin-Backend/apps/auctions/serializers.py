from rest_framework import serializers
from .models import Auction, Bid
from apps.coins.models import Period


class AuctionSerializer(serializers.ModelSerializer):
    creador_email = serializers.EmailField(source="creador.email", read_only=True)
    total_pujas = serializers.SerializerMethodField()
    periodo_nombre = serializers.CharField(source="periodo.nombre", read_only=True)
    grupo_nombre = serializers.CharField(source="periodo.grupo.nombre", read_only=True)

    class Meta:
        model = Auction
        fields = [
            "id",
            "titulo",
            "descripcion",
            "creador",
            "creador_email",
            "periodo",
            "periodo_nombre",
            "grupo_nombre",
            "fecha_fin",
            "estado",
            "total_pujas",
        ]
        read_only_fields = ["creador"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Filtrar periodos según el usuario que hace la petición
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
            
            # Si es docente, solo mostrar periodos de sus grupos
            if user.role == 'docente':
                self.fields['periodo'].queryset = Period.objects.filter(
                    grupo__classroom__docente=user
                )
            # Si es admin, mostrar todos
            elif user.role == 'admin' or user.is_staff:
                self.fields['periodo'].queryset = Period.objects.all()
            # Si es estudiante, no debería crear subastas pero por si acaso
            else:
                self.fields['periodo'].queryset = Period.objects.none()

    def get_total_pujas(self, obj):
        return obj.bids.count()


class BidSerializer(serializers.ModelSerializer):
    estudiante_email = serializers.EmailField(source="estudiante.email", read_only=True)
    auction_titulo = serializers.CharField(source="auction.titulo", read_only=True)

    class Meta:
        model = Bid
        fields = [
            "id",
            "auction",
            "auction_titulo",
            "estudiante",
            "estudiante_email",
            "cantidad",
        ]
        read_only_fields = ["estudiante"]