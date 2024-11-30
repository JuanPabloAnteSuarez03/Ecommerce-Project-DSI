from django.shortcuts import render
from rest_framework import viewsets
from .models import Pedido, DetallePedido
from .serializer import PedidoSerializer, DetallePedidoSerializer
from users.permissions import IsStaffUser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.permissions import DjangoModelPermissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from django.core.mail import EmailMessage
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

# Create your views here.

class PedidoView(viewsets.ModelViewSet):
    """
    API endpoint para gestionar pedidos.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer

    @swagger_auto_schema(
        operation_description="Obtener una lista de todos los pedidos.",
        responses={200: PedidoSerializer(many=True)},
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Crear un nuevo pedido.",
        request_body=PedidoSerializer,
        responses={201: PedidoSerializer},
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Obtener detalles de un pedido específico.",
        responses={200: PedidoSerializer},
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Actualizar un pedido existente.",
        request_body=PedidoSerializer,
        responses={200: PedidoSerializer},
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Eliminar un pedido.",
        responses={204: "No Content"},
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class DetallePedidoView(viewsets.ModelViewSet):
    """
    API endpoint para gestionar detalles de pedidos.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    queryset = DetallePedido.objects.all()
    serializer_class = DetallePedidoSerializer

    @swagger_auto_schema(
        operation_description="Obtener una lista de todos los detalles de pedidos.",
        responses={200: DetallePedidoSerializer(many=True)},
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Crear un nuevo detalle de pedido.",
        request_body=DetallePedidoSerializer,
        responses={201: DetallePedidoSerializer},
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Obtener detalles de un detalle de pedido específico.",
        responses={200: DetallePedidoSerializer},
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Actualizar un detalle de pedido existente.",
        request_body=DetallePedidoSerializer,
        responses={200: DetallePedidoSerializer},
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Eliminar un detalle de pedido.",
        responses={204: "No Content"},
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class FacturaEmailAPIView(APIView):
    """
    API para enviar por correo electrónico la factura de un pedido.
    """
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Enviar la factura de un pedido por correo electrónico.",
        manual_parameters=[
            openapi.Parameter(
                'pedido_id',
                openapi.IN_PATH,
                description="ID del pedido cuyo correo será enviado",
                type=openapi.TYPE_INTEGER,
            )
        ],
        responses={
            200: openapi.Response(
                description="Email enviado exitosamente con la factura adjunta.",
            ),
            400: "El pedido no tiene una factura generada.",
            404: "El pedido no existe.",
            500: "Error interno al enviar el email.",
        },
    )
    def post(self, request, pedido_id):
        try:
            # Obtener el pedido
            pedido = Pedido.objects.get(id=pedido_id)

            # Validar que el pedido tenga una factura asociada
            if not pedido.factura:
                return Response(
                    {'message': 'El pedido no tiene una factura generada'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Preparar el email
            subject = f'Factura de tu pedido #{pedido.id}'
            message = (
                f'Hola {pedido.usuario.username},\n\n'
                f'Gracias por tu pedido. Adjunto encontrarás la factura correspondiente a tu pedido.\n\n'
                f'Total: ${pedido.total:.2f}\n\n'
                f'Saludos.'
            )
            from_email = settings.EMAIL_HOST_USER
            to_email = pedido.usuario.email  # Asegúrate de que el usuario tiene un campo `email`

            # Crear el objeto EmailMessage
            email = EmailMessage(
                subject,
                message,
                from_email,
                [to_email]
            )

            # Adjuntar la factura
            factura_path = pedido.factura.path
            email.attach_file(factura_path)

            # Enviar el email
            email.send()

            return Response(
                {'message': 'Email enviado exitosamente con la factura adjunta'},
                status=status.HTTP_200_OK
            )

        except Pedido.DoesNotExist:
            return Response(
                {'message': 'El pedido no existe'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'message': f'Ocurrió un error al enviar el email: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )