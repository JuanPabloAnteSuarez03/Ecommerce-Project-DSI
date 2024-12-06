from django.contrib.auth.models import AbstractUser
from django.db import models

class Rol(models.Model):
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField()

    def __str__(self):
        return self.nombre

class Usuario(AbstractUser):
    cedula = models.CharField(max_length=10, unique=True)
    direccion = models.CharField(max_length=255)
    telefono = models.CharField(max_length=20)
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.username} - {self.rol.nombre}"

class MetodoPago(models.Model):
    tipo_pago = models.CharField(max_length=50)

    def __str__(self):
        return self.tipo_pago


class Incluye(models.Model):
    pedido = models.ForeignKey('orders.Pedido', on_delete=models.CASCADE)
    producto = models.ForeignKey('products.Producto', on_delete=models.CASCADE)  # Cambiado para evitar el import circular
    cantidad = models.IntegerField()

    def __str__(self):
        return f"{self.cantidad} x {self.producto.nombre_producto} en el pedido {self.pedido.id}"

class Pago(models.Model):
    pedido = models.ForeignKey('orders.Pedido', on_delete=models.CASCADE)
    metodo_pago = models.ForeignKey(MetodoPago, on_delete=models.CASCADE)
    monto = models.FloatField()
    fecha_pago = models.DateField()

    def __str__(self):
        return f"Pago de {self.monto} - {self.metodo_pago.tipo_pago} - {self.fecha_pago}"
