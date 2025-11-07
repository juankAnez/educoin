from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.api_register, name='register'),
    path('login/', views.api_login, name='login'),
    path('profile/', views.api_profile, name='profile'),
    path('profile/update/', views.api_update_profile, name='update-profile'),

    # Gestión de usuarios (admin)
    path('list/', views.api_list_users, name='list-users'),
    path('<int:user_id>/update/', views.api_update_user, name='update-user'),
    path('<int:user_id>/delete/', views.api_delete_user, name='delete-user'),

    path('google/', views.GoogleLoginAPIView.as_view(), name='google-login'),

    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('password-reset/', views.PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset-confirm/<uidb64>/<token>/', views.PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]