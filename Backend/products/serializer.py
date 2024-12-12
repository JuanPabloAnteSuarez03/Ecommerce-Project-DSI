# serializers.py
from rest_framework import serializers
from .models import Producto, Categoria, ProductoFavorito
from users.models import Usuario

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

    nombre_categoria = serializers.CharField(
        help_text="Nombre de la categoría"
    )

class ProductoSerializer(serializers.ModelSerializer):


    class Meta:
        model = Producto
        fields = '__all__'

    nombre_producto = serializers.CharField(
        help_text="Nombre del producto"
    )
    descripcion = serializers.CharField(
        help_text="Descripción detallada del producto"
    )
    categoria = serializers.PrimaryKeyRelatedField(
        help_text="ID de la categoría del producto",
        queryset=Categoria.objects.all()
    )
    precio = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Precio del producto"
    )
    stock = serializers.IntegerField(
        help_text="Cantidad disponible en inventario"
    )
    vendedor = serializers.PrimaryKeyRelatedField(
        help_text="ID del usuario vendedor",
        queryset=Usuario.objects.all()  # Asegúrate de importar User
    )
    imagen = serializers.ImageField(
        help_text="Imagen del producto (opcional)",
        required=False
    )

class ProductoFavoritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoFavorito
        fields = ['id', 'usuario', 'producto', 'fecha_agregado']
        read_only_fields = ['usuario', 'fecha_agregado']