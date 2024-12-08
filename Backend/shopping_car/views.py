# views.py

from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Carrito, CarritoItem
from products.models import Producto
from .serializers import CarritoSerializer

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.utils import timezone
from .models import Carrito, CarritoItem
from .serializers import CarritoSerializer
from products.models import Producto



class CartViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar el carrito de compras del usuario autenticado.

    Acciones principales:
    - `list`: Obtener los detalles del carrito del usuario actual.
    - `add_item`: Agregar un producto al carrito.
    - `remove_item`: Eliminar un producto del carrito.
    - `update_quantity`: Actualizar la cantidad de un producto en el carrito.
    - `clear`: Vaciar el carrito.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = CarritoSerializer

    def get_queryset(self):
        """
        Filtra el carrito para que solo se muestre el del usuario autenticado.
        """
        return Carrito.objects.filter(usuario=self.request.user)

    def get_or_create_cart(self):
        """
        Obtiene o crea el carrito del usuario autenticado.
        """
        carrito, created = Carrito.objects.get_or_create(
            usuario=self.request.user,
            defaults={'fecha_creacion': timezone.now()}
        )
        return carrito

    # Agregar producto al carrito
    @swagger_auto_schema(
        operation_description="Agregar un producto al carrito del usuario autenticado.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'product_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID del producto a agregar'),
                'cantidad': openapi.Schema(type=openapi.TYPE_INTEGER, description='Cantidad del producto (por defecto: 1)'),
            },
            required=['product_id'],
        ),
        responses={
            200: CarritoSerializer,
            404: "Producto no encontrado.",
        },
    )
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

    # Remover producto del carrito
    @swagger_auto_schema(
        operation_description="Eliminar un producto del carrito del usuario autenticado.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'product_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID del producto a eliminar'),
            },
            required=['product_id'],
        ),
        responses={
            200: CarritoSerializer,
            404: "Producto no encontrado en el carrito.",
        },
    )
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

    # Actualizar cantidad de un producto
    @swagger_auto_schema(
        operation_description="Actualizar la cantidad de un producto en el carrito del usuario autenticado.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'product_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID del producto a actualizar'),
                'cantidad': openapi.Schema(type=openapi.TYPE_INTEGER, description='Nueva cantidad del producto'),
            },
            required=['product_id', 'cantidad'],
        ),
        responses={
            200: CarritoSerializer,
            404: "Producto no encontrado en el carrito.",
        },
    )
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
    @swagger_auto_schema(
        operation_description="Vaciar el carrito del usuario autenticado.",
        responses={
            200: CarritoSerializer,
            500: "Error interno al intentar vaciar el carrito.",
        },
    )
    @action(detail=False, methods=['POST'])
    def clear(self, request):
        try:
            carrito = self.get_or_create_cart()
            items = CarritoItem.objects.filter(carrito=carrito)
            items.delete()
            serializer = CarritoSerializer(carrito)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
