from rest_framework.views import APIView
from rest_framework import status
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import update_session_auth_hash, get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.utils import timezone
from threading import Thread
from .models import User
from .token_models import EmailVerificationToken, PasswordResetAttempt, LoginFailureTracker
from .email_utils import (
    send_verification_email, 
    send_welcome_email, 
    send_password_reset_email,
    send_account_deletion_confirmation_email
)
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    ProfileSerializer,
    ChangePasswordSerializer
)
from .permissions import IsAdmin

User = get_user_model()
token_generator = PasswordResetTokenGenerator()


def get_client_ip(request):
    """Obtiene la IP del cliente"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


# --------------------------
# Registro
# --------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def api_register(request):
    """
    Registro manual - requiere verificación de email
    """
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        # Crear usuario SIN activar
        user = serializer.save()
        user.is_active = False  # Cuenta inactiva hasta verificar email
        user.email_verified = False
        user.save()
        
        # Crear y enviar token de verificación
        verification_token = EmailVerificationToken.objects.create(user=user)
        
        # Enviar email en segundo plano usando Thread
        email_thread = Thread(
            target=send_verification_email, 
            args=(user, verification_token)
        )
        email_thread.start()
        
        return Response({
            'message': 'Usuario registrado. Por favor verifica tu correo electrónico.',
            'email': user.email,
            'verification_required': True,
            'user_id': user.id
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'message': 'Error en el registro', 
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


# --------------------------
# Verificación de Email
# --------------------------
@api_view(['GET'])
@permission_classes([AllowAny])
def verify_email(request, token):
    """
    Verifica el email del usuario usando el token
    """
    try:
        verification_token = EmailVerificationToken.objects.get(token=token)
        
        if not verification_token.is_valid():
            return Response({
                'detail': 'El token de verificación ha expirado o ya fue usado.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Activar usuario
        user = verification_token.user
        user.is_active = True
        user.email_verified = True
        user.save()
        
        # Marcar token como usado
        verification_token.mark_as_used()
        
        # Enviar email de bienvenida
        send_welcome_email(user, is_google_signup=False)
        
        # Generar tokens JWT
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': '¡Email verificado exitosamente!',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_200_OK)
        
    except EmailVerificationToken.DoesNotExist:
        return Response({
            'detail': 'Token de verificación inválido.'
        }, status=status.HTTP_400_BAD_REQUEST)


# --------------------------
# Re-enviar email de verificación
# --------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def resend_verification_email(request):
    """
    Re-envía el email de verificación
    """
    email = request.data.get('email')
    
    try:
        user = User.objects.get(email=email)
        
        if user.email_verified:
            return Response({
                'detail': 'Este email ya está verificado.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Invalidar tokens anteriores
        EmailVerificationToken.objects.filter(
            user=user, 
            is_used=False
        ).update(is_used=True)
        
        # Crear nuevo token
        verification_token = EmailVerificationToken.objects.create(user=user)
        
        # Enviar email en segundo plano usando Thread
        email_thread = Thread(
            target=send_verification_email, 
            args=(user, verification_token)
        )
        email_thread.start()
        
        return Response({
            'message': 'Email de verificación reenviado exitosamente.'
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        # Por seguridad, no revelar si el email existe
        return Response({
            'message': 'Si el email existe, se ha enviado un nuevo código de verificación.'
        }, status=status.HTTP_200_OK)


# --------------------------
# Login manual
# --------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    """
    Login con tracking de fallos y sugerencia de reset
    """
    serializer = UserLoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # Verificar si el email está verificado
        if not user.email_verified:
            return Response({
                'message': 'Por favor verifica tu correo electrónico antes de iniciar sesión.',
                'email_not_verified': True,
                'email': user.email
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Login exitoso - limpiar fallos
        LoginFailureTracker.clear_failures(user.email)
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Login exitoso',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_200_OK)
    
    # Login fallido - registrar intento
    email = request.data.get('email')
    if email:
        ip_address = get_client_ip(request)
        LoginFailureTracker.objects.create(
            email=email,
            ip_address=ip_address
        )
        
        # Verificar si sugerir reset
        suggest_reset = LoginFailureTracker.should_suggest_reset(email)
        
        return Response({
            'message': 'Credenciales inválidas',
            'suggest_password_reset': suggest_reset,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({
        'message': 'Error en el login', 
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


# --------------------------
# Google login
# --------------------------
class GoogleLoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("id_token")
        if not token:
            return Response({"detail": "id_token requerido"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )
        except ValueError as e:
            return Response({"detail": f"Token inválido: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        email = idinfo.get("email")
        email_verified = idinfo.get("email_verified", False)
        first_name = idinfo.get("given_name") or email.split("@")[0]
        last_name = idinfo.get("family_name") or ""

        if not email or not email_verified:
            return Response({"detail": "Email no verificado por Google"}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(email=email, defaults={
            "first_name": first_name,
            "last_name": last_name,
            "username": email.split("@")[0],
            "is_active": True,
            "email_verified": True,  # ✅ Google ya verificó el email
        })
        
        if created:
            user.set_unusable_password()
            user.role = "estudiante"
            user.save()
            
            # Enviar email de bienvenida para registro con Google
            send_welcome_email(user, is_google_signup=True)

        refresh = RefreshToken.for_user(user)
        data = {
            "user": UserProfileSerializer(user).data,
            "tokens": {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        }
        return Response(data, status=status.HTTP_200_OK)


# --------------------------
# Perfil
# --------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_profile(request):
    serializer = UserProfileSerializer(request.user)
    return Response({'message': 'Perfil obtenido exitosamente', 'user': serializer.data})


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def api_update_profile(request):
    user = request.user

    # actualizar nombre, apellido, etc.
    user.first_name = request.data.get("first_name", user.first_name)
    user.last_name = request.data.get("last_name", user.last_name)
    user.save()

    # actualizar perfil
    profile_serializer = ProfileSerializer(user.profile, data=request.data, partial=True)
    if profile_serializer.is_valid():
        profile_serializer.save()
        return Response({
            "message": "Perfil actualizado exitosamente",
            "user": UserProfileSerializer(user).data
        })
    return Response(profile_serializer.errors, status=400)


# --------------------------
# Cambiar contraseña (logueado)
# --------------------------
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        
        if not serializer.is_valid():
            return Response({
                "detail": "Error en los datos",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        # Actualizar la sesión para evitar logout
        update_session_auth_hash(request, user)

        return Response({
            "detail": "Contraseña actualizada correctamente"
        }, status=status.HTTP_200_OK)

# --------------------------
# Reset password (flujo con email)
# --------------------------
class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        ip_address = get_client_ip(request)
        
        try:
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = token_generator.make_token(user)
            reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"
            
            # Registrar intento
            PasswordResetAttempt.objects.create(
                email=email,
                ip_address=ip_address,
                success=True
            )
            
            send_password_reset_email(user, reset_link)
            
        except User.DoesNotExist:
            # Registrar intento fallido
            PasswordResetAttempt.objects.create(
                email=email,
                ip_address=ip_address,
                success=False
            )
        
        # Siempre retornar el mismo mensaje por seguridad
        return Response({
            "detail": "Si el email existe, se ha enviado un enlace de restablecimiento."
        }, status=200)


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            
            if not token_generator.check_token(user, token):
                return Response({"detail": "Token inválido o expirado"}, status=400)

            new_password = request.data.get("new_password")
            if not new_password:
                return Response({"detail": "La nueva contraseña es requerida"}, status=400)
            
            user.set_password(new_password)
            user.save()
            
            # Limpiar fallos de login
            LoginFailureTracker.clear_failures(user.email)
            
            return Response({"detail": "Contraseña restablecida correctamente"}, status=200)
        except Exception as e:
            return Response({"detail": "Error al procesar el token"}, status=400)


# --------------------------
# Eliminar cuenta
# --------------------------
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def api_delete_account(request):
    """
    Permite al usuario eliminar su propia cuenta
    """
    user = request.user
    
    # Verificar contraseña para confirmar
    password = request.data.get('password')
    if not password:
        return Response({
            'detail': 'La contraseña es requerida para confirmar la eliminación'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not user.check_password(password):
        return Response({
            'detail': 'Contraseña incorrecta'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # No permitir eliminar admin si es el único
    if user.role == 'admin' and User.objects.filter(role='admin').count() <= 1:
        return Response({
            'detail': 'No puedes eliminar la última cuenta de administrador'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Enviar email de confirmación antes de eliminar
    user_email = user.email
    send_account_deletion_confirmation_email(user)
    
    # Eliminar usuario
    user.delete()
    
    return Response({
        'message': 'Cuenta eliminada exitosamente',
        'email': user_email
    }, status=status.HTTP_200_OK)


# --------------------------
# Lista de usuarios (solo admin)
# --------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def api_list_users(request):
    """
    Lista todos los usuarios del sistema (solo admin)
    """
    users = User.objects.all().order_by('-date_joined')
    serializer = UserProfileSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# --------------------------
# Actualizar usuario (solo admin)
# --------------------------
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsAdmin])
def api_update_user(request, user_id):
    """
    Actualizar datos de un usuario (solo admin)
    """
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"detail": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    # Actualizar campos básicos del usuario
    user.first_name = request.data.get("first_name", user.first_name)
    user.last_name = request.data.get("last_name", user.last_name)
    user.email = request.data.get("email", user.email)
    user.role = request.data.get("role", user.role)
    user.is_active = request.data.get("is_active", user.is_active)
    user.save()

    # Actualizar perfil si hay datos
    if 'profile' in request.data:
        profile_data = request.data['profile']
        profile_serializer = ProfileSerializer(user.profile, data=profile_data, partial=True)
        if profile_serializer.is_valid():
            profile_serializer.save()

    return Response({
        "message": "Usuario actualizado exitosamente",
        "user": UserProfileSerializer(user).data
    }, status=status.HTTP_200_OK)


# --------------------------
# Eliminar usuario (solo admin)
# --------------------------
@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdmin])
def api_delete_user(request, user_id):
    """
    Eliminar un usuario (solo admin)
    """
    try:
        user = User.objects.get(id=user_id)
        if user.role == 'admin' and User.objects.filter(role='admin').count() <= 1:
            return Response({
                "detail": "No se puede eliminar el último administrador"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user.delete()
        return Response({
            "message": "Usuario eliminado exitosamente"
        }, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"detail": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)