from rest_framework import serializers
from .models import Pedido, DetallePedido
from users.models import Usuario
from products.models import Producto
from .factura import generar_factura

class DetallePedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetallePedido
        fields = ['producto', 'cantidad']

    # Agregamos validaciones para los campos
    def validate(self, attrs):
        producto = attrs.get('producto')
        cantidad = attrs.get('cantidad')
        if cantidad <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor a 0.")
        if not producto:
            raise serializers.ValidationError("El producto es requerido.")
        return attrs


class PedidoSerializer(serializers.ModelSerializer):
    detalles = DetallePedidoSerializer(many=True)
    total = serializers.FloatField(read_only=True)  
    fecha_pedido = serializers.DateTimeField(read_only=True) 
    factura = serializers.ImageField(read_only=True) 

    class Meta:
        model = Pedido
        fields = ['id', 'usuario', 'fecha_pedido', 'total', 'estado', 'detalles', 'factura']

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles')
        pedido = Pedido.objects.create(**validated_data)
        total = 0

        # Crear los detalles y calcular el total
        for detalle_data in detalles_data:
            producto = detalle_data['producto']
            cantidad = detalle_data['cantidad']
            precio_unitario = producto.precio

            DetallePedido.objects.create(
                pedido=pedido,
                producto=producto,
                cantidad=cantidad,
                precio_unitario=precio_unitario
            )
            total += cantidad * precio_unitario

        pedido.total = total
        pedido.save()

        # Generar la factura
        factura_path = generar_factura(pedido)
        pedido.factura = factura_path
        pedido.save()

        return pedido

