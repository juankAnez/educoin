from rest_framework import serializers
from .models import Auction, Bid


class AuctionSerializer(serializers.ModelSerializer):
    creador_email = serializers.EmailField(source="creador.email", read_only=True)
    total_pujas = serializers.SerializerMethodField()

    class Meta:
        model = Auction
        fields = [
            "id",
            "titulo",
            "descripcion",
            "creador",
            "creador_email",
            "periodo",
            "fecha_fin",
            "estado",
            "total_pujas",
        ]
        read_only_fields = ["creador"]
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