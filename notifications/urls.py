from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import NotificationViewSet

router = DefaultRouter()
router.register(r'api/v2/notifications', NotificationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
