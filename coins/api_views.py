from rest_framework import status, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction
from .models import EducoinWallet, EducoinTransaction
from users.models import User
from groups.models import Group
from .serializers import (
    EducoinWalletSerializer, 
    EducoinTransactionSerializer, 
    AwardEducoinsSerializer
)

class EducoinWalletViewSet(viewsets.ModelViewSet):
    queryset = EducoinWallet.objects.all()
    serializer_class = EducoinWalletSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return EducoinWallet.objects.all()
        elif user.role == 'docente':
            # Docente puede ver wallets de sus estudiantes (opcional, aquí solo la suya)
            return EducoinWallet.objects.filter(user=user)
        elif user.role == 'estudiante':
            return EducoinWallet.objects.filter(user=user)
        return EducoinWallet.objects.none()

class EducoinTransactionViewSet(viewsets.ModelViewSet):
    queryset = EducoinTransaction.objects.all()
    serializer_class = EducoinTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return EducoinTransaction.objects.all()
        elif user.role == 'docente':
            # Docente puede ver transacciones que realizó o de sus estudiantes (opcional, aquí solo las que realizó)
            return EducoinTransaction.objects.filter(performed_by=user)
        elif user.role == 'estudiante':
            return EducoinTransaction.objects.filter(wallet__user=user)
        return EducoinTransaction.objects.none()

    def perform_create(self, serializer):
        # Asigna automáticamente el usuario que realiza la transacción
        serializer.save(performed_by=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_award_educoins_drf(request):
    """Otorgar Educoins a un estudiante con DRF"""
    if request.user.role == 'teacher':
        return Response({
            'message': 'Solo los profesores pueden otorgar Educoins',
            'error': 'permission_denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    serializer = AwardEducoinsSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        student_email = serializer.validated_data['student_email']
        group_id = serializer.validated_data['group_id']
        amount = serializer.validated_data['amount']
        description = serializer.validated_data['description']
        
        # Obtener objetos
        student = User.objects.get(email=student_email)
        group = Group.objects.get(id=group_id)
        
        with transaction.atomic():
            # Obtener o crear wallet
            wallet, created = EducoinWallet.objects.get_or_create(
                student=student,
                group=group,
                defaults={'balance': 0}
            )
            
            # Actualizar balance
            wallet.balance += amount
            wallet.save()
            
            # Crear transacción
            edu_transaction = EducoinTransaction.objects.create(
                wallet=wallet,
                amount=amount,
                transaction_type='earned',
                description=description
            )
        
        return Response({
            'message': f'Se otorgaron {amount} Educoins exitosamente',
            'wallet': EducoinWalletSerializer(wallet).data,
            'transaction': EducoinTransactionSerializer(edu_transaction).data
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'message': 'Error al otorgar Educoins',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_student_balance_drf(request):
    """Obtener balance de Educoins del estudiante"""
    if request.user.role != 'student':
        return Response({
            'message': 'Solo los estudiantes pueden consultar su balance',
            'error': 'permission_denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    wallets = EducoinWallet.objects.filter(student=request.user).order_by('group__name')
    serializer = EducoinWalletSerializer(wallets, many=True)
    
    total_balance = sum(wallet.balance for wallet in wallets)
    
    return Response({
        'message': 'Balance obtenido exitosamente',
        'wallets': serializer.data,
        'total_balance': total_balance,
        'count': wallets.count()
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_group_balances_drf(request, group_id):
    """Obtener balances de todos los estudiantes de un grupo (solo profesores)"""
    if request.user.role != 'teacher':
        return Response({
            'message': 'Solo los profesores pueden ver balances del grupo',
            'error': 'permission_denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        group = Group.objects.get(id=group_id, teacher=request.user)
        wallets = EducoinWallet.objects.filter(group=group).order_by('-balance')
        serializer = EducoinWalletSerializer(wallets, many=True)
        
        return Response({
            'message': 'Balances del grupo obtenidos exitosamente',
            'group': {
                'id': group.id,
                'name': group.name,
                'subject': group.subject
            },
            'wallets': serializer.data,
            'count': wallets.count()
        }, status=status.HTTP_200_OK)
        
    except Group.DoesNotExist:
        return Response({
            'message': 'Grupo no encontrado o no autorizado',
            'error': 'not_found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_transaction_history_drf(request):
    """Obtener historial de transacciones del estudiante"""
    if request.user.role != 'student':
        return Response({
            'message': 'Solo los estudiantes pueden ver su historial',
            'error': 'permission_denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Obtener transacciones de todas las wallets del estudiante
    transactions = EducoinTransaction.objects.filter(
        wallet__student=request.user
    ).order_by('-created_at')[:50]  # Últimas 50 transacciones
    
    serializer = EducoinTransactionSerializer(transactions, many=True)
    
    return Response({
        'message': 'Historial obtenido exitosamente',
        'transactions': serializer.data,
        'count': transactions.count()
    }, status=status.HTTP_200_OK)