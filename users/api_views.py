from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer
from rest_framework import serializers, viewsets, permissions
from rest_framework.permissions import IsAuthenticated, BasePermission, SAFE_METHODS
from .models import Classroom, Activity, CoinTransaction, Auction, Bid, User
from .permissions import IsAdmin, IsDocente, IsEstudiante, AdminOrDocentePermission, AdminOrReadOnly

# Serializers
class ClassroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classroom
        fields = '__all__'

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'

class CoinTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoinTransaction
        fields = '__all__'

class AuctionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Auction
        fields = '__all__'

class BidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bid
        fields = '__all__'

class UserRegisterSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'role', 'password', 'password_confirm')

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Las contraseñas no coinciden.")
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        # Si no se envía username, lo generamos a partir del email
        if not validated_data.get('username'):
            validated_data['username'] = validated_data['email'].split('@')[0]
        user = User.objects.create_user(**validated_data)
        return user

# ViewSets con permisos por rol

class ClassroomViewSet(viewsets.ModelViewSet):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer

    def get_permissions(self):
        if self.request.user.is_authenticated and self.request.user.role == 'admin':
            return [IsAuthenticated(), IsAdmin()]
        elif self.request.user.is_authenticated and self.request.user.role == 'docente':
            # Docente puede crear, listar, editar y eliminar SOLO sus propias clases
            return [IsAuthenticated(), IsDocente()]
        elif self.request.user.is_authenticated and self.request.user.role == 'estudiante':
            # Estudiante solo puede ver las clases a las que pertenece
            if self.action in ['list', 'retrieve']:
                return [IsAuthenticated(), IsEstudiante()]
            return [permissions.IsAdminUser()]  # Bloquea POST, PUT, DELETE
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == 'admin':
            return Classroom.objects.all()
        elif user.is_authenticated and user.role == 'docente':
            return Classroom.objects.filter(docente=user)
        elif user.is_authenticated and user.role == 'estudiante':
            return Classroom.objects.filter(estudiantes=user)
        return Classroom.objects.none()

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

    def get_permissions(self):
        if self.request.user.is_authenticated and self.request.user.role == 'admin':
            return [IsAuthenticated(), IsAdmin()]
        elif self.request.user.is_authenticated and self.request.user.role == 'docente':
            return [IsAuthenticated(), IsDocente()]
        elif self.request.user.is_authenticated and self.request.user.role == 'estudiante':
            if self.action in ['list', 'retrieve']:
                return [IsAuthenticated(), IsEstudiante()]
            return [permissions.IsAdminUser()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == 'admin':
            return Activity.objects.all()
        elif user.is_authenticated and user.role == 'docente':
            return Activity.objects.filter(classroom__docente=user)
        elif user.is_authenticated and user.role == 'estudiante':
            return Activity.objects.filter(classroom__estudiantes=user)
        return Activity.objects.none()

class CoinTransactionViewSet(viewsets.ModelViewSet):
    queryset = CoinTransaction.objects.all()
    serializer_class = CoinTransactionSerializer

    def get_permissions(self):
        if self.request.user.is_authenticated and self.request.user.role == 'admin':
            return [IsAuthenticated(), IsAdmin()]
        elif self.request.user.is_authenticated and self.request.user.role == 'docente':
            return [IsAuthenticated(), IsDocente()]
        elif self.request.user.is_authenticated and self.request.user.role == 'estudiante':
            if self.action in ['list', 'retrieve']:
                return [IsAuthenticated(), IsEstudiante()]
            return [permissions.IsAdminUser()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == 'admin':
            return CoinTransaction.objects.all()
        elif user.is_authenticated and user.role == 'docente':
            # Docente ve transacciones de sus clases
            return CoinTransaction.objects.filter(actividad__classroom__docente=user)
        elif user.is_authenticated and user.role == 'estudiante':
            return CoinTransaction.objects.filter(estudiante=user)
        return CoinTransaction.objects.none()

class AuctionViewSet(viewsets.ModelViewSet):
    queryset = Auction.objects.all()
    serializer_class = AuctionSerializer

    def get_permissions(self):
        if self.request.user.is_authenticated and self.request.user.role == 'admin':
            return [IsAuthenticated(), IsAdmin()]
        elif self.request.user.is_authenticated and self.request.user.role == 'docente':
            return [IsAuthenticated(), IsDocente()]
        elif self.request.user.is_authenticated and self.request.user.role == 'estudiante':
            if self.action in ['list', 'retrieve']:
                return [IsAuthenticated(), IsEstudiante()]
            return [permissions.IsAdminUser()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == 'admin':
            return Auction.objects.all()
        elif user.is_authenticated and user.role == 'docente':
            return Auction.objects.filter(docente=user)
        elif user.is_authenticated and user.role == 'estudiante':
            return Auction.objects.filter(classroom__estudiantes=user)
        return Auction.objects.none()

class BidViewSet(viewsets.ModelViewSet):
    queryset = Bid.objects.all()
    serializer_class = BidSerializer

    def get_permissions(self):
        if self.request.user.is_authenticated and self.request.user.role == 'admin':
            return [IsAuthenticated(), IsAdmin()]
        elif self.request.user.is_authenticated and self.request.user.role == 'docente':
            # Docente solo puede ver pujas de sus subastas
            if self.action in ['list', 'retrieve']:
                return [IsAuthenticated(), IsDocente()]
            return [permissions.IsAdminUser()]
        elif self.request.user.is_authenticated and self.request.user.role == 'estudiante':
            # Estudiante puede crear/ver sus propias pujas
            if self.action in ['list', 'retrieve', 'create']:
                return [IsAuthenticated(), IsEstudiante()]
            return [permissions.IsAdminUser()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == 'admin':
            return Bid.objects.all()
        elif user.is_authenticated and user.role == 'docente':
            return Bid.objects.filter(auction__docente=user)
        elif user.is_authenticated and user.role == 'estudiante':
            return Bid.objects.filter(estudiante=user)
        return Bid.objects.none()

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