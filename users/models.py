from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

class Categoria(models.Model):
    nombre_categoria = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre_categoria

class PerfilUsuario(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"Perfil de {self.usuario.username}"

class Vendedor(models.Model):
    perfil = models.OneToOneField(PerfilUsuario, on_delete=models.CASCADE)

    def __str__(self):
        return f"Vendedor: {self.perfil.usuario.username}"

class Comprador(models.Model):
    perfil = models.OneToOneField(PerfilUsuario, on_delete=models.CASCADE)

    def __str__(self):
        return f"Comprador: {self.perfil.usuario.username}"

class Producto(models.Model):
    nombre_producto = models.CharField(max_length=100)
    descripcion = models.TextField()
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    vendedor = models.ForeignKey(Vendedor, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre_producto

class Carrito(models.Model):
    comprador = models.ForeignKey(Comprador, on_delete=models.CASCADE)
    fecha_creacion = models.DateField()

    def __str__(self):
        return f"Carrito de {self.comprador}"

class Contiene(models.Model):
    carrito = models.ForeignKey(Carrito, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()

    def __str__(self):
        return f"{self.cantidad} de {self.producto} en {self.carrito}"

class Pedido(models.Model):
    comprador = models.ForeignKey(Comprador, on_delete=models.CASCADE)
    fecha_pedido = models.DateField()
    total = models.FloatField()
    estado = models.BooleanField()

    def __str__(self):
        return f"Pedido #{self.id} de {self.comprador}"

class Incluye(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()

    def __str__(self):
        return f"{self.cantidad} de {self.producto} en {self.pedido}"

class MetodoPago(models.Model):
    tipo_pago = models.CharField(max_length=50)

    def __str__(self):
        return self.tipo_pago

class Pago(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    metodo_pago = models.ForeignKey(MetodoPago, on_delete=models.CASCADE)
    monto = models.FloatField()
    fecha_pago = models.DateField()

    def __str__(self):
        return f"Pago de {self.monto} para {self.pedido}"
