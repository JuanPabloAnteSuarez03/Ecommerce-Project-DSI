# views.py
from rest_framework import viewsets
from .models import Producto, Categoria
from .serializer import ProductSerializer, CategorySerializer
from users.permissions import IsStaffUser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.permissions import DjangoModelPermissions

class CategoriaView(viewsets.ModelViewSet):
    """
    API endpoint para gestionar categorías de productos.
    
    list:
        Retorna una lista de todas las categorías.
    create:
        Crea una nueva categoría.
    retrieve:
        Retorna una categoría específica.
    update:
        Actualiza una categoría existente.
    delete:
        Elimina una categoría.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    queryset = Categoria.objects.all()
    serializer_class = CategorySerializer

class ProductoView(viewsets.ModelViewSet):
    """
    API endpoint para gestionar productos.
    
    list:
        Retorna una lista de todos los productos.
    create:
        Crea un nuevo producto.
    retrieve:
        Retorna un producto específico.
    update:
        Actualiza un producto existente.
    delete:
        Elimina un producto.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    queryset = Producto.objects.all()
    serializer_class = ProductSerializer
