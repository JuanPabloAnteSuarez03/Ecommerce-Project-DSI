from django.db import models
from users.models import Usuario
from products.models import Producto


# Create your models here.

class Carrito(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Carrito de {self.usuario.username} - {self.fecha_creacion}"

class CarritoItem(models.Model):  # Renombre Contiene a CarritoItem para mayor claridad
    carrito = models.ForeignKey(Carrito, related_name='items', on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField(default=1)
    
    class Meta:
        unique_together = ('carrito', 'producto')  # Esto evita duplicados
    
    def __str__(self):
        return f"{self.cantidad} x {self.producto.nombre_producto} en {self.carrito}"
    
    @property
    def subtotal(self):
        return self.cantidad * self.producto.precio

