import os
import django
import sys

# Agregar el directorio base al path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Educoin.settings')

try:
    django.setup()
    
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    # Crear superusuario
    if not User.objects.filter(email='ivanjmm01@gmail.com').exists():
        User.objects.create_superuser(
            email='ivanjmm01@gmail.com',
            username='ivnmtz09',
            password='3226800403iM.'  # Cambia esto por tu password real
        )
        print("✅ Superusuario creado exitosamente!")
    else:
        print("ℹ️ El superusuario ya existe")
        
except Exception as e:
    print(f"❌ Error creando superusuario: {e}")
    # Continuar aunque falle