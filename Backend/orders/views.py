from django.shortcuts import render
from rest_framework import viewsets
from .models import Pedido, DetallePedido, Factura
from .serializer import PedidoSerializer, DetallePedidoSerializer, FacturaSerializer
from users.permissions import IsStaffUser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.permissions import DjangoModelPermissions
# Create your views here.

class PedidoView(viewsets.ModelViewSet):
    """
    API endpoint para gestionar pedidos.
    
    list:
        Retorna una lista de todos los pedidos.
    create:
        Crea un nuevo pedido.
    retrieve:
        Retorna un pedido específico.
    update:
        Actualiza un pedido existente.
    delete:
        Elimina un pedido.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer

class DetallePedidoView(viewsets.ModelViewSet):
    """
    API endpoint para gestionar detalles de pedidos.
    
    list:
        Retorna una lista de todos los detalles de pedidos.
    create:
        Crea un nuevo detalle de pedido.
    retrieve:
        Retorna un detalle de pedido específico.
    update:
        Actualiza un detalle de pedido existente.
    delete:
        Elimina un detalle de pedido.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    queryset = DetallePedido.objects.all()
    serializer_class = DetallePedidoSerializer

class FacturaView(viewsets.ModelViewSet):
    """
    API endpoint para gestionar facturas.
    
    list:
        Retorna una lista de todas las facturas.
    create:
        Crea una nueva factura.
    retrieve:
        Retorna una factura específica.
    update:
        Actualiza una factura existente.
    delete:
        Elimina una factura.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    queryset = Factura.objects.all()
    serializer_class = FacturaSerializer