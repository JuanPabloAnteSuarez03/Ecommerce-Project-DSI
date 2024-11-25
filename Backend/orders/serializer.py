from rest_framework import serializers
from .models import Pedido, DetallePedido, Factura
from users.models import Usuario
from products.models import Producto

class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = '__all__'

    usuario = serializers.PrimaryKeyRelatedField(
        help_text="ID del usuario que realizó el pedido",
        queryset=Usuario.objects.all()
    )
    fecha_pedido = serializers.DateTimeField(
        help_text="Fecha y hora en que se realizó el pedido",
        read_only=True
    )
    total = serializers.FloatField(
        help_text="Total del pedido"
    )
    estado = serializers.BooleanField(
        help_text="Estado del pedido"
    )

class DetallePedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetallePedido
        fields = '__all__'

    pedido = serializers.PrimaryKeyRelatedField(
        help_text="ID del pedido al que pertenece este detalle",
        queryset=Pedido.objects.all()
    )
    producto = serializers.PrimaryKeyRelatedField(
        help_text="ID del producto en este detalle",
        queryset=Producto.objects.all()
    )
    cantidad = serializers.IntegerField(
        help_text="Cantidad de unidades del producto"
    )
    precio_unitario = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Precio unitario del producto"
    )

class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = '__all__'

    numero_factura = serializers.CharField(
        help_text="Número de la factura"
    )
    pedido = serializers.PrimaryKeyRelatedField(
        help_text="ID del pedido asociado a esta factura",
        queryset=Pedido.objects.all()
    )
    cliente = serializers.PrimaryKeyRelatedField(
        help_text="ID del cliente que realizó el pedido",
        queryset=Usuario.objects.all()
    )
    fecha_emision = serializers.DateField(
        help_text="Fecha de emisión de la factura",
        read_only=True
    )
    monto_total = serializers.FloatField(
        help_text="Monto total de la factura"
    )
    descuento = serializers.FloatField(
        help_text="Descuento aplicado a la factura",
        default=0.0
    )
    total_final = serializers.FloatField(
        help_text="Total final de la factura"
    )