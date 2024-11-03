from rest_framework import serializers
from products.models import Producto
from .models import Carrito, CarritoItem

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['id', 'nombre_producto', 'precio', 'imagen']


class CarritoItemSerializer(serializers.ModelSerializer):
    producto = ProductSerializer(read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CarritoItem
        fields = ['id', 'producto', 'cantidad', 'subtotal']

class CarritoSerializer(serializers.ModelSerializer):
    items = CarritoItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Carrito
        fields = ['id', 'fecha_creacion', 'items', 'total']

    def get_total(self, obj):
        return sum(item.subtotal for item in obj.items.all())

