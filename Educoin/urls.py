from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.shortcuts import render

def home_view(request):
    """Vista simple para la página principal"""
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Educoin - Sistema de Gamificación Educativa</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                max-width: 800px; 
                margin: 50px auto; 
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            .container {
                background: rgba(255,255,255,0.1);
                padding: 30px;
                border-radius: 15px;
                backdrop-filter: blur(10px);
            }
            h1 { color: #fff; text-align: center; }
            .status { color: #90EE90; margin: 10px 0; }
            .api-list { background: rgba(0,0,0,0.2); padding: 20px; border-radius: 10px; margin: 20px 0; }
            .api-item { margin: 8px 0; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 5px; }
            a { color: #90EE90; text-decoration: none; }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎓 Bienvenido a Educoin</h1>
            <p class="status">✅ Sistema funcionando correctamente</p>
            
            <h3>🔧 Panel de Administración:</h3>
            <p><a href="/admin/" target="_blank">🔗 Acceder al Admin Panel</a></p>
            
            <h3>🚀 APIs Disponibles:</h3>
            <div class="api-list">
                <div class="api-item">🔐 <a href="/users/api/login/" target="_blank">Login de usuarios</a></div>
                <div class="api-item">📝 <a href="/users/api/register/" target="_blank">Registro de usuarios</a></div>
                <div class="api-item">👥 <a href="/users/api/create-group/" target="_blank">Crear grupos</a></div>
                <div class="api-item">🏫 <a href="/users/api/teacher-groups/" target="_blank">Grupos del profesor</a></div>
                <div class="api-item">➕ <a href="/users/api/add-student-to-group/" target="_blank">Agregar estudiantes</a></div>
                <div class="api-item">🪙 <a href="/users/api/award-educoins/" target="_blank">Otorgar Educoins</a></div>
                <div class="api-item">🏺 <a href="/users/api/create-auction/" target="_blank">Crear subastas</a></div>
                <div class="api-item">🔒 <a href="/users/api/close-auction/" target="_blank">Cerrar subastas</a></div>
            </div>
            
            <h3>📊 Estado del Proyecto:</h3>
            <p class="status">✅ Semana 1: Seguridad implementada</p>
            <p class="status">✅ Semana 2: Modelos organizados</p>
            <p class="status">🔄 Semana 3: Listo para Django REST Framework</p>
        </div>
    </body>
    </html>
    """
    return HttpResponse(html)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
    path('', home_view, name='home'),  # ← ESTA LÍNEA ES LA QUE AGREGAMOS
    # Agrega esta línea a tu urlpatterns existente:
    path('groups/', include('groups.urls')),
    path('coins/', include('coins.urls')),
    path('auctions/', include('auctions.urls')),

]