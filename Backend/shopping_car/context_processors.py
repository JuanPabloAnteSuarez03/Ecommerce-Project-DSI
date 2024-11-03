from rest_framework.response import Response
from rest_framework import status

def total_car_amount(request):
    total = 0
    if (request.user.is_authenticated):
        for key, value in request.session["carro"].items():
            total = total + (float(value["precio"]) * value ["cantidad"])
            return {"importe_total_carro" : total}