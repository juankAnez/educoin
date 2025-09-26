from django.urls import path
from . import api_views

app_name = 'auctions'

urlpatterns = [
    # Crear subasta (POST)
    path('api/create/', api_views.api_create_auction_drf, name='api_create_auction'),
    
    # Listar subastas (GET)
    path('api/list/', api_views.api_list_auctions_drf, name='api_list_auctions'),
    
    # Detalles de subasta específica (GET)
    path('api/<int:auction_id>/', api_views.api_auction_detail_drf, name='api_auction_detail'),
    
    # Realizar puja (POST)
    path('api/bid/', api_views.api_place_bid_drf, name='api_place_bid'),
    
    # Cerrar subasta (POST)
    path('api/<int:auction_id>/close/', api_views.api_close_auction_drf, name='api_close_auction'),
    
    # Ver pujas del estudiante (GET)
    path('api/my-bids/', api_views.api_student_bids_drf, name='api_student_bids'),
]