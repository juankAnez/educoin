from rest_framework.routers import DefaultRouter
from .views import PeriodViewSet, WalletViewSet, CoinTransactionViewSet

router = DefaultRouter()
router.register(r'periods', PeriodViewSet, basename="periods")
router.register(r'wallets', WalletViewSet, basename="wallets")
router.register(r'transactions', CoinTransactionViewSet, basename="transactions")

urlpatterns = router.urls
