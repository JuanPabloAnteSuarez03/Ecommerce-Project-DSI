from rest_framework import serializers
from products.models import Producto
from .models import Carrito, CarritoItem
import base64

class ProductSerializer(serializers.ModelSerializer):
    imagen = serializers.SerializerMethodField()
    class Meta:
        model = Producto
        fields = ['id', 'nombre_producto', 'precio', 'imagen']

    def get_imagen(self, obj):
        if obj.imagen:
            # Convierte la imagen a base64
            return f"data:image/png;base64,{base64.b64encode(obj.imagen).decode('utf-8')}"
        return None


class CarritoItemSerializer(serializers.ModelSerializer):
    producto = ProductSerializer(read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CarritoItem
        fields = ['id', 'producto', 'cantidad', 'subtotal']

class CarritoSerializer(serializers.ModelSerializer):
    items = CarritoItemSerializer(many=True, read_only=True)

    class Meta:
        model = Carrito
        fields = ['id', 'usuario', 'fecha_creacion', 'items']

    def get_total(self, obj):
        return sum(item.subtotal for item in obj.items.all())

