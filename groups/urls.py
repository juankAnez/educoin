from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import GroupViewSet, StudentGroupViewSet
import groups.api_views as api_views
router = DefaultRouter()
router.register(r'api/v2/groups', GroupViewSet)
router.register(r'api/v2/student-groups', StudentGroupViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # APIs DRF v2 para grupos
    path('api/v2/create/', api_views.api_create_group_drf, name='api_create_group_drf'),
    path('api/v2/teacher-groups/', api_views.api_teacher_groups_drf, name='api_teacher_groups_drf'),
    path('api/v2/add-student/', api_views.api_add_student_to_group_drf, name='api_add_student_drf'),
    path('api/v2/<int:group_id>/students/', api_views.api_group_students_drf, name='api_group_students_drf'),
]