from rest_framework import status, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction
from .models import Auction, AuctionBid
from groups.models import Group, StudentGroup
from coins.models import EducoinWallet, EducoinTransaction
from .serializers import (
    AuctionSerializer,
    AuctionBidSerializer, 
    CreateAuctionSerializer,
    PlaceBidSerializer
)

class AuctionViewSet(viewsets.ModelViewSet):
    queryset = Auction.objects.all()
    serializer_class = AuctionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Auction.objects.all()
        elif user.role == 'docente':
            return Auction.objects.filter(docente=user)
        elif user.role == 'estudiante':
            return Auction.objects.filter(group__student_groups__student=user)
        return Auction.objects.none()

    def perform_create(self, serializer):
        if self.request.user.role == 'docente':
            serializer.save(docente=self.request.user)

class AuctionBidViewSet(viewsets.ModelViewSet):
    queryset = AuctionBid.objects.all()
    serializer_class = AuctionBidSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return AuctionBid.objects.all()
        elif user.role == 'docente':
            return AuctionBid.objects.filter(auction__docente=user)
        elif user.role == 'estudiante':
            return AuctionBid.objects.filter(estudiante=user)
        return AuctionBid.objects.none()

    def perform_create(self, serializer):
        if self.request.user.role == 'estudiante':
            serializer.save(estudiante=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_create_auction_drf(request):
    """Crear una nueva subasta (solo profesores)"""
    if request.user.role == 'teacher':
        return Response({
            'message': 'Solo los profesores pueden crear subastas',
            'error': 'permission_denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    serializer = CreateAuctionSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        title = serializer.validated_data['title']
        description = serializer.validated_data['description']
        starting_bid = serializer.validated_data['starting_bid']
        group_id = serializer.validated_data['group_id']
        
        group = Group.objects.get(id=group_id)
        
        auction = Auction.objects.create(
            title=title,
            description=description,
            starting_bid=starting_bid,
            group=group,
            status='active'
        )
        
        return Response({
            'message': 'Subasta creada exitosamente',
            'auction': AuctionSerializer(auction).data
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'message': 'Error al crear la subasta',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_list_auctions_drf(request):
    """Listar subastas según el tipo de usuario"""
    if request.user.role == 'teacher':
        # Profesores ven sus propias subastas
        auctions = Auction.objects.filter(group__teacher=request.user).order_by('-created_at')
    else:
        # Estudiantes ven subastas de sus grupos
        student_groups = StudentGroup.objects.filter(student=request.user).values_list('group', flat=True)
        auctions = Auction.objects.filter(group__in=student_groups).order_by('-created_at')
    
    serializer = AuctionSerializer(auctions, many=True)
    
    return Response({
        'message': 'Subastas obtenidas exitosamente',
        'auctions': serializer.data,
        'count': auctions.count()
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_auction_detail_drf(request, auction_id):
    """Obtener detalles de una subasta específica"""
    try:
        if request.user.role == 'teacher':
            auction = Auction.objects.get(id=auction_id, group__teacher=request.user)
        else:
            # Verificar que el estudiante pertenezca al grupo
            student_groups = StudentGroup.objects.filter(student=request.user).values_list('group', flat=True)
            auction = Auction.objects.get(id=auction_id, group__in=student_groups)
        
        # Obtener las pujas de esta subasta
        bids = AuctionBid.objects.filter(auction=auction).order_by('-amount')
        
        return Response({
            'message': 'Detalles de subasta obtenidos',
            'auction': AuctionSerializer(auction).data,
            'bids': AuctionBidSerializer(bids, many=True).data,
            'bids_count': bids.count()
        }, status=status.HTTP_200_OK)
        
    except Auction.DoesNotExist:
        return Response({
            'message': 'Subasta no encontrada o no autorizada',
            'error': 'not_found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_place_bid_drf(request):
    """Realizar una puja en una subasta (solo estudiantes)"""
    if request.user.role != 'student':
        return Response({
            'message': 'Solo los estudiantes pueden pujar',
            'error': 'permission_denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    serializer = PlaceBidSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        auction_id = serializer.validated_data['auction_id']
        amount = serializer.validated_data['amount']
        
        auction = Auction.objects.get(id=auction_id)
        
        with transaction.atomic():
            # Crear o actualizar la puja (ya que unique_together permite solo una por estudiante)
            bid, created = AuctionBid.objects.update_or_create(
                auction=auction,
                student=request.user,
                defaults={'amount': amount}
            )
            
            # Si es una nueva puja, podríamos crear una transacción de "reserva"
            # (opcional, dependiendo de tu lógica de negocio)
        
        action = 'creada' if created else 'actualizada'
        
        return Response({
            'message': f'Puja {action} exitosamente',
            'bid': AuctionBidSerializer(bid).data,
            'auction': AuctionSerializer(auction).data
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
    
    return Response({
        'message': 'Error al realizar la puja',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_close_auction_drf(request, auction_id):
    """Cerrar una subasta y determinar ganador (solo profesores)"""
    if request.user.role != 'teacher':
        return Response({
            'message': 'Solo los profesores pueden cerrar subastas',
            'error': 'permission_denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        auction = Auction.objects.get(id=auction_id, group__teacher=request.user, status='active')
        
        with transaction.atomic():
            # Obtener la puja ganadora (más alta)
            winning_bid = auction.auctionbid_set.order_by('-amount').first()
            
            if winning_bid:
                # Establecer ganador
                auction.winner = winning_bid.student
                auction.winning_bid = winning_bid.amount
                
                # Descontar Educoins del ganador
                wallet = EducoinWallet.objects.get(
                    student=winning_bid.student,
                    group=auction.group
                )
                wallet.balance -= winning_bid.amount
                wallet.save()
                
                # Crear transacción
                EducoinTransaction.objects.create(
                    wallet=wallet,
                    amount=-winning_bid.amount,
                    transaction_type='spent',
                    description=f'Ganó subasta: {auction.title}'
                )
            
            # Cerrar subasta
            auction.status = 'closed'
            auction.save()
        
        winner_info = None
        if winning_bid:
            winner_info = {
                'student_name': winning_bid.student.get_full_name(),
                'student_email': winning_bid.student.email,
                'winning_amount': winning_bid.amount
            }
        
        return Response({
            'message': 'Subasta cerrada exitosamente',
            'auction': AuctionSerializer(auction).data,
            'winner': winner_info
        }, status=status.HTTP_200_OK)
        
    except Auction.DoesNotExist:
        return Response({
            'message': 'Subasta no encontrada, no activa o no autorizada',
            'error': 'not_found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_student_bids_drf(request):
    """Obtener pujas del estudiante"""
    if request.user.role != 'student':
        return Response({
            'message': 'Solo los estudiantes pueden ver sus pujas',
            'error': 'permission_denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    bids = AuctionBid.objects.filter(student=request.user).order_by('-created_at')
    serializer = AuctionBidSerializer(bids, many=True)
    
    return Response({
        'message': 'Pujas obtenidas exitosamente',
        'bids': serializer.data,
        'count': bids.count()
    }, status=status.HTTP_200_OK)