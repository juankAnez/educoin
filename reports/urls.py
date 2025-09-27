from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import ReportViewSet

router = DefaultRouter()
router.register(r'api/v2/reports', ReportViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
