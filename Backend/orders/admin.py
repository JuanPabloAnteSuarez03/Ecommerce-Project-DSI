from django.contrib import admin
from .models import Pedido, DetallePedido

# Register your models here.

admin.site.register(Pedido)
admin.site.register(DetallePedido)
