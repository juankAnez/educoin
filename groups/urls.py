from django.urls import path
from . import api_views

urlpatterns = [
    # APIs DRF v2 para grupos
    path('api/v2/create/', api_views.api_create_group_drf, name='api_create_group_drf'),
    path('api/v2/teacher-groups/', api_views.api_teacher_groups_drf, name='api_teacher_groups_drf'),
    path('api/v2/add-student/', api_views.api_add_student_to_group_drf, name='api_add_student_drf'),
    path('api/v2/<int:group_id>/students/', api_views.api_group_students_drf, name='api_group_students_drf'),
]