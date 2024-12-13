from django.conf import settings
from django.http import JsonResponse
from rest_framework.views import APIView
import stripe
import requests
from shopping_car.models import Carrito
from rest_framework.permissions import IsAuthenticated

stripe.api_key = settings.STRIPE_SECRET_KEY


class CreateCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            carrito = Carrito.objects.filter(usuario=user).first()

            if not carrito or not carrito.items.exists():
                return JsonResponse({'error': 'El carrito está vacío'}, status=400)

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
                metadata={'user_id': user.id},
                success_url='https://ecommerce-project-frontend-rhra.onrender.com/productos',
                cancel_url='https://ecommerce-project-frontend-rhra.onrender.com/carrito',
            )

            return JsonResponse({'id': checkout_session.id})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


class StripeWebhookView(APIView):
    def post(self, request, *args, **kwargs):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except ValueError:
            return JsonResponse({'error': 'Invalid payload'}, status=400)
        except stripe.error.SignatureVerificationError:
            return JsonResponse({'error': 'Invalid signature'}, status=400)

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            line_items = stripe.checkout.Session.list_line_items(session['id'])

            for item in line_items['data']:
                producto_id = item['price']['product']
                cantidad = item['quantity']

                response = requests.post(
                    'https://ecommerce-backend-zm43.onrender.com/orders/api/detallePedidos/',
                    json={
                        'producto': producto_id,
                        'cantidad': cantidad,
                    }
                )
                if response.status_code != 201:
                    return JsonResponse({'error': 'Error creando la orden'}, status=400)

        return JsonResponse({'status': 'success'}, status=200)
