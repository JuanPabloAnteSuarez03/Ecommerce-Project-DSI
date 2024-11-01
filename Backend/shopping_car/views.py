from django.shortcuts import render
from .car import Car
from users.models import Producto
from django.shortcuts import redirect

# Create your views here.

# Agreagar producto
def add_product(request, product_id):

    car = Car(request)

    product = Producto.objects.get(id = product_id)

    car.add(product = product)

    #Redirecionar a la tienda
    return redirect("Tienda") 

# Eliminar Producto
def delete_product(request, product_id):

    car = Car(request)

    product = Producto.objects.get(id = product_id)

    car.delete(product = product)

    #Redirecionar a la tienda
    return redirect("Tienda") 

#Restar Producto
def subtract_product(request, product_id):

    car = Car(request)

    product = Producto.objects.get(id = product_id)

    car.subtract(product = product)

    #Redirecionar a la tienda
    return redirect("Tienda") 

# Limpiar Carro
def clean_car(request, product_id):

    car = Car(request)

    car.clean_car()

    #Redirecionar a la tienda
    return redirect("Tienda") 