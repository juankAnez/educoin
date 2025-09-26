from django.urls import path
from . import api_views

urlpatterns = [
    # APIs DRF v2 para Educoins
    path('api/v2/award/', api_views.api_award_educoins_drf, name='api_award_educoins_drf'),
    path('api/v2/balance/', api_views.api_student_balance_drf, name='api_student_balance_drf'),
    path('api/v2/group/<int:group_id>/balances/', api_views.api_group_balances_drf, name='api_group_balances_drf'),
    path('api/v2/history/', api_views.api_transaction_history_drf, name='api_transaction_history_drf'),
]