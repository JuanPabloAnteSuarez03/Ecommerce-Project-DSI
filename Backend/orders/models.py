from django.db import models
from products.models import Producto

# Create your models here.
class Pedido(models.Model):
    usuario = models.ForeignKey('users.Usuario', on_delete=models.CASCADE)
    fecha_pedido = models.DateTimeField(auto_now_add=True)
    total = models.FloatField(null=True, blank=True)
    estado = models.BooleanField()
    factura = models.ImageField(upload_to='facturas/', null=True, blank=True)  # Nuevo campo

    def __str__(self):
        estado_str = "Completado" if self.estado else "Pendiente"
        return f"Pedido de {self.usuario.username} - {estado_str} - {self.fecha_pedido}"



class DetallePedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name="detalles")
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    @property
    def subtotal(self):
        return self.cantidad * self.precio_unitario


    def __str__(self):
        return f"{self.cantidad} x {self.producto.nombre_producto} en {self.pedido.numero_pedido}"
    