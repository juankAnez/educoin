from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuctionViewSet, BidViewSet

router = DefaultRouter()
router.register(r'auctions', AuctionViewSet, basename="auctions")
router.register(r'bids', BidViewSet, basename="bids")

urlpatterns = [
    path('', include(router.urls)),
]