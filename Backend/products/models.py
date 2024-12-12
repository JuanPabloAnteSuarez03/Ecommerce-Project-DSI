# models.py
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings


class Categoria(models.Model):
    nombre_categoria = models.CharField(
        max_length=50,
        help_text="Nombre de la categoría del producto"
    )

    def __str__(self):
        return self.nombre_categoria

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"
    
class Producto(models.Model):
    nombre_producto = models.CharField(
        max_length=100,
        help_text="Nombre del producto"
    )
    descripcion = models.TextField(
        help_text="Descripción detallada del producto"
    )
    categoria = models.ForeignKey(
        Categoria, 
        on_delete=models.CASCADE,
        help_text="Categoría a la que pertenece el producto"
    )
    precio = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        help_text="Precio del producto (máximo 10 dígitos, 2 decimales)"
    )
    stock = models.IntegerField(
        help_text="Cantidad disponible en inventario"
    )
    ventas = models.IntegerField(
        default=0,
        help_text="Cantidad de veces que se ha vendido el producto"
    )
    vendedor = models.ForeignKey(
        'users.Usuario', 
        on_delete=models.CASCADE,
        help_text="Usuario vendedor del producto"
    )
    imagen = models.ImageField(
        upload_to='productos/', 
        null=True, 
        blank=True,
        help_text="Imagen del producto (opcional)"
    )

    def __str__(self):
        return f"{self.nombre_producto} - {self.categoria.nombre_categoria}"


class ProductoFavorito(models.Model):
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # Usar la referencia correcta al modelo de usuario
        on_delete=models.CASCADE
    )
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    fecha_agregado = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('usuario', 'producto')  # Evitar duplicados
        verbose_name = "Producto Favorito"
        verbose_name_plural = "Productos Favoritos"

    def __str__(self):
        return f"{self.usuario.username} - {self.producto.nombre_producto}"
