from django.shortcuts import render
import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework import response
from rest_framework import status
from shopping_car.models import Carrito
from rest_framework.permissions import IsAuthenticated

# Create your views here.

stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            user = request.user  # Usuario autenticado
            carrito = Carrito.objects.filter(usuario=user).first()

            if not carrito or not carrito.items.exists():
                return response.Response({'error': 'El carrito está vacío'}, status=status.HTTP_400_BAD_REQUEST)

            line_items = []
            for item in carrito.items.all():
                product = item.producto
                line_items.append({
                    'price_data': {
                        'currency': 'usd',
                        'unit_amount': int(product.precio * 100),
                        'product_data': {
                            'name': product.nombre_producto,
                        },
                    },
                    'quantity': item.cantidad,
                })

            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=line_items,
                mode='payment',
                metadata={'user_id': user.id},  # Agregar el ID del usuario
                success_url='https://ecommerce-project-frontend-rhra.onrender.com/productos',
                cancel_url='https://ecommerce-project-frontend-rhra.onrender.com/carrito',
            )

            return response.Response({'id': checkout_session.id})
        except Exception as e:
            return response.Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
