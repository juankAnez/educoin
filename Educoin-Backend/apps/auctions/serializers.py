from rest_framework import serializers
from .models import Auction, Bid


class AuctionSerializer(serializers.ModelSerializer):
    docente_email = serializers.EmailField(source="docente.email", read_only=True)

    class Meta:
        model = Auction
        fields = [
            "id",
            "nombre",
            "descripcion",
            "docente",
            "docente_email",
            "periodo",
            "fecha_inicio",
            "fecha_fin",
            "estado",
        ]


class BidSerializer(serializers.ModelSerializer):
    estudiante_email = serializers.EmailField(source="estudiante.email", read_only=True)
    auction_nombre = serializers.CharField(source="auction.nombre", read_only=True)

    class Meta:
        model = Bid
        fields = [
            "id",
            "auction",
            "auction_nombre",
            "estudiante",
            "estudiante_email",
            "cantidad",
            "fecha",
        ]
        read_only_fields = ["fecha"]
