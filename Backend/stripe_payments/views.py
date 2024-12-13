from django.conf import settings
from django.http import JsonResponse
from rest_framework.views import APIView
import stripe
import requests
import logging
from shopping_car.models import Carrito
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User

stripe.api_key = settings.STRIPE_SECRET_KEY

logger = logging.getLogger(__name__)

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
                metadata={'user_id': user.id},  # Metadatos para vincular al usuario
                success_url='https://ecommerce-project-frontend-rhra.onrender.com/productos',
                cancel_url='https://ecommerce-project-frontend-rhra.onrender.com/carrito',
            )

            return JsonResponse({'id': checkout_session.id})
        except Exception as e:
            logger.error(f"Error creando la sesión de checkout: {e}")
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
            logger.error("Invalid payload")
            return JsonResponse({'error': 'Invalid payload'}, status=400)
        except stripe.error.SignatureVerificationError:
            logger.error("Invalid signature")
            return JsonResponse({'error': 'Invalid signature'}, status=400)

        logger.info(f"Evento recibido: {event['type']}")

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            user_id = session['metadata'].get('user_id')  # Recupera el ID del usuario
            logger.info(f"Datos de la sesión: {session}")
            logger.info(f"ID de usuario: {user_id}")

            # Verifica si el usuario existe
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                logger.error(f"Usuario con ID {user_id} no encontrado")
                return JsonResponse({'error': 'Usuario no encontrado'}, status=404)

            try:
                # Genera un token de acceso dinámico para el usuario
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)

                # Procesa los productos del carrito
                line_items = stripe.checkout.Session.list_line_items(session['id'])
                detalles = []
                for item in line_items['data']:
                    logger.info(f"Procesando item: {item}")

                    # Mapear correctamente al ID del producto en tu base de datos
                    producto_id = item['price']['product']
                    cantidad = item['quantity']

                    detalles.append({
                        'producto': producto_id,  # Mapea correctamente al ID de tu base de datos
                        'cantidad': cantidad,
                    })

                # Realiza la solicitud autenticada al endpoint de pedidos
                response = requests.post(
                    'https://ecommerce-backend-zm43.onrender.com/orders/api/pedidos/',
                    json={
                        'usuario': user_id,
                        'estado': True,  # O el valor que represente un pedido completado
                        'detalles': detalles,
                    },
                    headers={
                        'Authorization': f'Bearer {access_token}', 
                    }
                )

                if response.status_code != 201:
                    logger.error(f"Error creando pedido: {response.text}")
                    return JsonResponse({'error': 'Error creando el pedido'}, status=400)

            except Exception as e:
                logger.error(f"Error procesando el webhook: {e}")
                return JsonResponse({'error': str(e)}, status=500)

        return JsonResponse({'status': 'success'}, status=200)
