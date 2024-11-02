# models.py
from django.db import models

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

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"