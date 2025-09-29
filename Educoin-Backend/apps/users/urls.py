from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.api_register, name='register'),
    path('login/', views.api_login, name='login'),
    path('profile/', views.api_profile, name='profile'),
]
