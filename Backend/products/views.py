# views.py
from rest_framework import viewsets
from .models import Producto, Categoria
from .serializer import ProductSerializer, CategorySerializer

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
    queryset = Producto.objects.all()
    serializer_class = ProductSerializer