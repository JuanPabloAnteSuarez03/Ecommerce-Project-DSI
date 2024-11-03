from django.contrib import admin
from .models import Carrito, CarritoItem

# Register your models here.

admin.site.register(Carrito)
admin.site.register(CarritoItem)