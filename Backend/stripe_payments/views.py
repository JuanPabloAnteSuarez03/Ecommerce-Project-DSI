from django.conf import settings
from django.http import JsonResponse
from rest_framework.views import APIView
import stripe
import requests

stripe.api_key = settings.STRIPE_SECRET_KEY

class StripeWebhookView(APIView):
    def post(self, request, *args, **kwargs):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        endpoint_secret = settings.STRIPE_WEBHOOK_SECRET  # Configura esta clave en tus settings

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except ValueError as e:
            # Invalid payload
            return JsonResponse({'error': 'Invalid payload'}, status=400)
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            return JsonResponse({'error': 'Invalid signature'}, status=400)

        # Maneja el evento específico
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']

            # Extraer información necesaria (por ejemplo, el carrito o productos)
            line_items = stripe.checkout.Session.list_line_items(session['id'])

            # Crear una orden en tu API
            for item in line_items['data']:
                producto_id = item['price']['product']  # Debes mapear tu producto en Stripe con tu base de datos
                cantidad = item['quantity']

                # Llama a tu API de órdenes
                response = requests.post(
                    'https://ecommerce-backend-zm43.onrender.com/orders/api/detallePedidos/',  # URL de tu API
                    json={
                        'producto': producto_id,
                        'cantidad': cantidad
                    }
                )
                if response.status_code != 201:
                    return JsonResponse({'error': 'Error creando la orden'}, status=400)

        return JsonResponse({'status': 'success'}, status=200)