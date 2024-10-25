from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

class Rol(models.Model):
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField()

    def __str__(self):
        return self.nombre

class Usuario(models.Model):
    username = models.CharField(max_length=50, unique=True, default="username")
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    cedula = models.CharField(max_length=10, unique=True)
    correo = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    direccion = models.CharField(max_length=255)
    telefono = models.CharField(max_length=20)
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.nombre} {self.apellido} - {self.correo}"

class MetodoPago(models.Model):
    tipo_pago = models.CharField(max_length=50)

    def __str__(self):
        return self.tipo_pago

class Categoria(models.Model):
    nombre_categoria = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre_categoria

class Producto(models.Model):
    nombre_producto = models.CharField(max_length=100)
    descripcion = models.TextField()
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    vendedor = models.ForeignKey(Usuario, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.nombre_producto} - {self.categoria.nombre_categoria}"


class Carrito(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    fecha_creacion = models.DateField()

    def __str__(self):
        return f"Carrito de {self.usuario.nombre} - {self.fecha_creacion}"

class Contiene(models.Model):
    carrito = models.ForeignKey(Carrito, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()

    def __str__(self):
        return f"{self.cantidad} x {self.producto.nombre_producto} en {self.carrito}"

class Pedido(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    fecha_pedido = models.DateField()
    total = models.FloatField()
    estado = models.BooleanField()

    def __str__(self):
        estado_str = "Completado" if self.estado else "Pendiente"
        return f"Pedido de {self.usuario.nombre} - {estado_str} - {self.fecha_pedido}"

class Incluye(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()

    def __str__(self):
        return f"{self.cantidad} x {self.producto.nombre_producto} en el pedido {self.pedido.id}"

class Pago(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    metodo_pago = models.ForeignKey(MetodoPago, on_delete=models.CASCADE)
    monto = models.FloatField()
    fecha_pago = models.DateField()

    def __str__(self):
        return f"Pago de {self.monto} - {self.metodo_pago.tipo_pago} - {self.fecha_pago}"

class Factura(models.Model):
    numero_factura = models.CharField(max_length=20, unique=True)
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    cliente = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    fecha_emision = models.DateField(auto_now_add=True)
    monto_total = models.FloatField()
    descuento = models.FloatField(default=0.0)
    total_final = models.FloatField()

    def __str__(self):
        return f"Factura {self.numero_factura} - Cliente: {self.cliente.nombre}"
