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
            user = request.user  # Asegurar de que el usuario esté autenticado
            carrito = Carrito.objects.filter(usuario=user).first()

            if not carrito or not carrito.items.exists():
                return response.Response({'error': 'El carrito está vacío'}, status=status.HTTP_400_BAD_REQUEST)

            line_items = []
            for item in carrito.items.all():
                product = item.producto
                line_items.append({
                    'price_data': {
                        'currency': 'usd',
                        'unit_amount': int(product.precio * 100),  # Asegúrate de que `price` esté en dólares
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
                success_url='http://127.0.0.1:8000/success',
                cancel_url='http://127.0.0.1:8000/cancel',
            )

            return response.Response({'id': checkout_session.id})
        except Exception as e:
            return response.Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        pass
        

class StripeWebhookView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        payload = request.body
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']
        event = None

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST)

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']

            user_id = session.get('metadata', {}).get('user_id')  

            if user_id:
                Carrito.objects.filter(usuario_id=user_id).delete()

        return response.Response(status=status.HTTP_200_OK)
    