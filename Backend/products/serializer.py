# serializers.py
from rest_framework import serializers
from .models import Producto, Categoria, ProductoFavorito
from users.models import Usuario
import base64
import imghdr

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
        fields  = ['id', 'nombre_producto', 'descripcion', 'categoria', 'precio', 'stock', 'vendedor', 'imagen']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.imagen:
            import base64
            imagen_base64 = base64.b64encode(instance.imagen).decode('utf-8')
            representation['imagen'] = f"data:image/png;base64,{imagen_base64}"
        return representation

    def create(self, validated_data):
        imagen = self.context['request'].FILES.get('imagen')
        if imagen:
            validated_data['imagen'] = imagen.read()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        imagen = self.context['request'].FILES.get('imagen')
        if imagen:
            instance.imagen = imagen.read()
        for attr, value in validated_data.items():
            if attr != 'imagen':
                setattr(instance, value)
        instance.save()
        return instance

class ProductoFavoritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoFavorito
        fields = ['id', 'usuario', 'producto', 'fecha_agregado']
        read_only_fields = ['usuario', 'fecha_agregado']