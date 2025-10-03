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
from django.core.mail import send_mail

from .models import User
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    ProfileSerializer,
    ChangePasswordSerializer
)

User = get_user_model()
token_generator = PasswordResetTokenGenerator()


# --------------------------
# Registro
# --------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def api_register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Usuario creado exitosamente',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_201_CREATED)
    return Response({'message': 'Error en el registro', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# --------------------------
# Login manual
# --------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Login exitoso',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_200_OK)
    return Response({'message': 'Error en el login', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


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
            print("IDINFO DEBUG:", idinfo)

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
        })
        if created:
            user.set_unusable_password()
            user.role = "estudiante"
            user.save()

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
# Cambiar contraseña (logueado)
# --------------------------
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({"detail": "La contraseña actual es incorrecta"}, status=400)

        user.set_password(serializer.validated_data['new_password'])
        user.save()
        update_session_auth_hash(request, user)

        return Response({"detail": "Contraseña actualizada correctamente"})


# --------------------------
# Reset password (flujo con email)
# --------------------------
class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        try:
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = token_generator.make_token(user)
            reset_link = f"http://localhost:5173/reset-password/{uid}/{token}/"
            print("Reset link:", reset_link)

            send_mail(
                subject="Recupera tu contraseña",
                message=f"Usa este enlace para restablecer tu contraseña: {reset_link}",
                from_email="no-reply@educoin.com",
                recipient_list=[email],
            )
        except User.DoesNotExist:
            pass
        return Response({"detail": "Si el email existe, se ha enviado un enlace"}, status=200)


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            if not token_generator.check_token(user, token):
                return Response({"detail": "Token inválido"}, status=400)

            new_password = request.data.get("new_password")
            user.set_password(new_password)
            user.save()
            return Response({"detail": "Contraseña restablecida correctamente"}, status=200)
        except Exception:
            return Response({"detail": "Error al procesar el token"}, status=400)
