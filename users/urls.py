from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import api_views, views

router = DefaultRouter()
router.register(r'api/v2/classrooms', api_views.ClassroomViewSet)
router.register(r'api/v2/activities', api_views.ActivityViewSet)
router.register(r'api/v2/cointransactions', api_views.CoinTransactionViewSet)
router.register(r'api/v2/auctions', api_views.AuctionViewSet)
router.register(r'api/v2/bids', api_views.BidViewSet)

urlpatterns = [
    # APIs originales
    path('api/login/', views.api_login, name='api_login'),
    path('api/register/', views.api_register, name='api_register'),
    path('api/create-group/', views.api_create_group, name='api_create_group'),
    path('api/teacher-groups/', views.api_teacher_groups, name='api_teacher_groups'),
    path('api/add-student-to-group/', views.api_add_student_to_group, name='api_add_student_to_group'),
    path('api/award-educoins/', views.api_award_educoins, name='api_award_educoins'),
    path('api/create-auction/', views.api_create_auction, name='api_create_auction'),
    path('api/close-auction/', views.api_close_auction, name='api_close_auction'),

    # Nuevas APIs con DRF
    path('api/v2/register/', api_views.api_register_drf, name='api_register_drf'),
    path('api/v2/login/', api_views.api_login_drf, name='api_login_drf'),
    path('api/v2/profile/', api_views.api_profile, name='api_profile'),

    # Refresh token
    path('api/v2/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('', include(router.urls)),
]
