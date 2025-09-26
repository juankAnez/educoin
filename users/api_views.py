from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def api_register_drf(request):
    """Registro de usuarios con DRF"""
    serializer = UserRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        
        # Crear tokens JWT
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        return Response({
            'message': 'Usuario creado exitosamente',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'access': str(access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'message': 'Error en el registro',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def api_login_drf(request):
    """Login de usuarios con DRF"""
    serializer = UserLoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # Crear tokens JWT
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        return Response({
            'message': 'Login exitoso',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'access': str(access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_200_OK)
    
    return Response({
        'message': 'Error en el login',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def api_profile(request):
    """Obtener perfil del usuario autenticado"""
    serializer = UserProfileSerializer(request.user)
    return Response({
        'message': 'Perfil obtenido exitosamente',
        'user': serializer.data
    }, status=status.HTTP_200_OK)