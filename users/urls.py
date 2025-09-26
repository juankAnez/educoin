from django.urls import path
from . import api_views, views
from django.http import HttpResponse

def users_home(request):
    """Vista principal para mostrar las APIs disponibles"""
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Educoin - APIs de Usuario</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            h1 { color: #333; }
            .api-item { 
                margin: 15px 0; 
                padding: 15px; 
                border: 1px solid #ddd; 
                border-radius: 8px;
                background: #f9f9f9;
            }
            .method { 
                background: #007bff; 
                color: white; 
                padding: 4px 8px; 
                border-radius: 4px; 
                font-size: 12px; 
            }
            a { color: #007bff; text-decoration: none; }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <h1>🔧 APIs de Usuario - Educoin</h1>
        <p><a href="/">← Volver al inicio</a></p>
        
        <div class="api-item">
            <span class="method">POST</span>
            <strong><a href="/users/api/login/">Login de usuarios</a></strong>
            <p>Autenticación de usuarios en el sistema</p>
        </div>
        
        <div class="api-item">
            <span class="method">POST</span>
            <strong><a href="/users/api/register/">Registro de usuarios</a></strong>
            <p>Crear nuevos usuarios (estudiantes/profesores)</p>
        </div>
        
        <div class="api-item">
            <span class="method">POST</span>
            <strong><a href="/users/api/create-group/">Crear grupos</a></strong>
            <p>Crear grupos educativos</p>
        </div>
        
        <div class="api-item">
            <span class="method">GET</span>
            <strong><a href="/users/api/teacher-groups/">Grupos del profesor</a></strong>
            <p>Ver grupos creados por el profesor</p>
        </div>
        
        <div class="api-item">
            <span class="method">POST</span>
            <strong><a href="/users/api/add-student-to-group/">Agregar estudiante</a></strong>
            <p>Agregar estudiantes a grupos</p>
        </div>
        
        <div class="api-item">
            <span class="method">POST</span>
            <strong><a href="/users/api/award-educoins/">Otorgar Educoins</a></strong>
            <p>Sistema de recompensas con monedas</p>
        </div>
        
        <div class="api-item">
            <span class="method">POST</span>
            <strong><a href="/users/api/create-auction/">Crear subasta</a></strong>
            <p>Crear nuevas subastas educativas</p>
        </div>
        
        <div class="api-item">
            <span class="method">POST</span>
            <strong><a href="/users/api/close-auction/">Cerrar subasta</a></strong>
            <p>Finalizar subastas activas</p>
        </div>
    </body>
    </html>
    """
    return HttpResponse(html)

urlpatterns = [
    path('', users_home, name='users_home'),
    
    # APIs originales
    path('api/login/', views.api_login, name='api_login'),
    path('api/register/', views.api_register, name='api_register'),
    path('api/create-group/', views.api_create_group, name='api_create_group'),
    path('api/teacher-groups/', views.api_teacher_groups, name='api_teacher_groups'),
    path('api/add-student-to-group/', views.api_add_student_to_group, name='api_add_student_to_group'),
    path('api/award-educoins/', views.api_award_educoins, name='api_award_educoins'),
    path('api/create-auction/', views.api_create_auction, name='api_create_auction'),
    path('api/close-auction/', views.api_close_auction, name='api_close_auction'),
    
    # ← NUEVAS APIs con DRF
    path('api/v2/register/', api_views.api_register_drf, name='api_register_drf'),
    path('api/v2/login/', api_views.api_login_drf, name='api_login_drf'),
    path('api/v2/profile/', api_views.api_profile, name='api_profile'),
]