# views.py
from rest_framework import viewsets
from .models import Producto, Categoria
from .serializer import ProductoSerializer, CategorySerializer
from users.permissions import IsStaffUser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.permissions import DjangoModelPermissions
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
class CategoriaView(viewsets.ModelViewSet):
    """
    API endpoint para gestionar categorías de productos.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    queryset = Categoria.objects.all()
    serializer_class = CategorySerializer

    @swagger_auto_schema(
        operation_description="Obtener una lista de todas las categorías.",
        responses={200: CategorySerializer(many=True)},
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Crear una nueva categoría.",
        request_body=CategorySerializer,
        responses={201: CategorySerializer},
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Obtener detalles de una categoría específica.",
        responses={200: CategorySerializer},
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Actualizar una categoría existente.",
        request_body=CategorySerializer,
        responses={200: CategorySerializer},
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Eliminar una categoría.",
        responses={204: "No Content"},
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class ProductoView(viewsets.ModelViewSet):
    """
    API endpoint para gestionar productos.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

    def get_serializer_context(self):
            """
            Agrega el objeto request al contexto del serializador para construir URLs absolutas.
            """
            return {'request': self.request}


    @swagger_auto_schema(
        operation_description="Obtener una lista de todos los productos.",
        responses={200: ProductoSerializer(many=True)},
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Crear un nuevo producto.",
        request_body=ProductoSerializer,
        responses={201: ProductoSerializer},
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Obtener detalles de un producto específico.",
        responses={200: ProductoSerializer},
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Actualizar un producto existente.",
        request_body=ProductoSerializer,
        responses={200: ProductoSerializer},
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Eliminar un producto.",
        responses={204: "No Content"},
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
