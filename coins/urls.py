from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import EducoinWalletViewSet, EducoinTransactionViewSet
import coins.api_views as api_views

router = DefaultRouter()
router.register(r'api/v2/wallets', EducoinWalletViewSet)
router.register(r'api/v2/transactions', EducoinTransactionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # APIs DRF v2 para Educoins
    path('api/v2/award/', api_views.api_award_educoins_drf, name='api_award_educoins_drf'),
    path('api/v2/balance/', api_views.api_student_balance_drf, name='api_student_balance_drf'),
    path('api/v2/group/<int:group_id>/balances/', api_views.api_group_balances_drf, name='api_group_balances_drf'),
    path('api/v2/history/', api_views.api_transaction_history_drf, name='api_transaction_history_drf'),
]