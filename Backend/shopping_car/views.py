# views.py
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Carrito, CarritoItem
from products.models import Producto
from .serializers import CarritoSerializer, CarritoItemSerializer

class CartViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CarritoSerializer

    def get_queryset(self):
        return Carrito.objects.filter(usuario=self.request.user)

    def get_or_create_cart(self):
        carrito, created = Carrito.objects.get_or_create(
            usuario=self.request.user,
            defaults={'fecha_creacion': timezone.now()}
        )
        return carrito

    # Agregar producto al carrito
    @action(detail=False, methods=['POST'])
    def add_item(self, request):
        carrito = self.get_or_create_cart()
        product_id = request.data.get('product_id')
        cantidad = int(request.data.get('cantidad', 1))

        try:
            producto = Producto.objects.get(id=product_id)
            item, created = CarritoItem.objects.get_or_create(
                carrito=carrito,
                producto=producto,
                defaults={'cantidad': cantidad}
            )
            if not created:
                item.cantidad += cantidad
                item.save()
            
            serializer = CarritoSerializer(carrito)
            return Response(serializer.data)
        except Producto.DoesNotExist:
            return Response(
                {'error': 'Producto no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )

    # Remover producto al carrito
    @action(detail=False, methods=['POST'])
    def remove_item(self, request):
        carrito = self.get_or_create_cart()
        product_id = request.data.get('product_id')
        
        try:
            item = CarritoItem.objects.get(
                carrito=carrito,
                producto_id=product_id
            )
            item.delete()
            serializer = CarritoSerializer(carrito)
            return Response(serializer.data)
        except CarritoItem.DoesNotExist:
            return Response(
                {'error': 'Producto no encontrado en el carrito'},
                status=status.HTTP_404_NOT_FOUND
            )

    # cantidad de actualización, osea si el producto de carrito < 0 se eliminara del carrito
    @action(detail=False, methods=['POST'])
    def update_quantity(self, request):
        carrito = self.get_or_create_cart()
        product_id = request.data.get('product_id')
        cantidad = int(request.data.get('cantidad', 1))

        try:
            item = CarritoItem.objects.get(
                carrito=carrito,
                producto_id=product_id
            )
            if cantidad > 0:
                item.cantidad = cantidad
                item.save()
            else:
                item.delete()
            
            serializer = CarritoSerializer(carrito)
            return Response(serializer.data)
        except CarritoItem.DoesNotExist:
            return Response(
                {'error': 'Producto no encontrado en el carrito'},
                status=status.HTTP_404_NOT_FOUND
            )

    # Limpiar carrito
    @action(detail=False, methods=['POST'])
    def clear(self, request):
        carrito = self.get_or_create_cart()
        CarritoItem.objects.filter(carrito=carrito).delete()
        serializer = CarritoSerializer(carrito)
        return Response(serializer.data)