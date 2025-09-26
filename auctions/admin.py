from django.contrib import admin
from .models import Auction, AuctionBid

admin.site.register(Auction)
admin.site.register(AuctionBid)