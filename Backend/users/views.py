# views.py
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password, make_password
from .models import Usuario, Rol
from .serializers import UsuarioSerializer
from .mixins import StaffRequiredMixin
from .permissions import IsStaffUser
from django.contrib.auth.models import Group
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from .tokens import account_activation_token
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.http import HttpResponseRedirect
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi 
import logging




logger = logging.getLogger(__name__) 

from rest_framework.response import Response


class LoginView(APIView):
    """
    Vista para autenticar usuarios y generar tokens de acceso.
    """
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Autenticar un usuario con su username y password.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING, description='Nombre de usuario'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='Contraseña'),
            },
            required=['username', 'password'],
        ),
        responses={
            200: openapi.Response(
                description="Login exitoso",
                examples={
                    "application/json": {
                        "message": "Login exitoso",
                        "user": {
                            "username": "john_doe",
                            "email": "john@example.com",
                            "cedula": "123456789",
                            "rol": "admin"
                        },
                        "tokens": {
                            "refresh": "ey...",
                            "access": "ey..."
                        }
                    }
                },
            ),
            400: "Se requieren username y password.",
            401: "Credenciales inválidas o cuenta no activada.",
        }
    )
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password') 
        print("Request data:", request.data)
        
        
        if not username or not password:
            return Response(
                {'message': 'Se requieren username y password'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = Usuario.objects.get(username=username)
        except Usuario.DoesNotExist:
            return Response(
                {'message': 'Credenciales inválidas'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Primero verifica si el usuario está activo
        if not user.is_active:
            return Response(
                {'message': 'Tu cuenta no está activada. Por favor, verifica tu correo electrónico'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if check_password(password, user.password):
            refresh = RefreshToken.for_user(user)
            refresh['rol'] = user.rol.nombre 
            

            return Response({
                'message': 'Login exitoso',
                'user': {
                    'username': user.username,
                    'email': user.email,
                    'cedula': user.cedula,
                    'rol': user.rol.nombre,
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),

                }
            })
        
        return Response(
            {'message': 'Credenciales inválidas'},
            status=status.HTTP_401_UNAUTHORIZED
        )



class SignUpView(APIView):
    """
    Vista para registrar nuevos usuarios.
    """
    permission_classes = [AllowAny]
        

    @swagger_auto_schema(
        operation_description="Registrar un nuevo usuario en el sistema.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING, description='Nombre de usuario'),
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='Correo electrónico'),
                'first_name': openapi.Schema(type=openapi.TYPE_STRING, description='Nombre'),
                'last_name': openapi.Schema(type=openapi.TYPE_STRING, description='Apellido'),
                'cedula': openapi.Schema(type=openapi.TYPE_STRING, description='Cédula del usuario'),
                'password1': openapi.Schema(type=openapi.TYPE_STRING, description='Contraseña'),
                'password2': openapi.Schema(type=openapi.TYPE_STRING, description='Confirmación de la contraseña'),
                'direccion': openapi.Schema(type=openapi.TYPE_STRING, description='Dirección del usuario'),
                'telefono': openapi.Schema(type=openapi.TYPE_STRING, description='Teléfono del usuario'),
                'rol': openapi.Schema(type=openapi.TYPE_STRING, description='Rol del usuario'),
                'groups': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(type=openapi.TYPE_INTEGER),
                    description='Lista de IDs de los grupos del usuario',
                ),
            },
            required=['username', 'email', 'first_name', 'last_name', 'cedula', 'password1', 'password2', 'direccion', 'telefono', 'rol'],
        ),
        responses={
            201: "Usuario creado exitosamente. Revisa tu correo para confirmar tu cuenta.",
            400: "Error en los datos enviados (por ejemplo, contraseñas no coinciden).",
            500: "Error al enviar el correo de confirmación.",
        }
    )


    def post(self, request):
        try:
            # Obtén los datos del formulario
            username = request.data.get('username')
            email = request.data.get('email')
            first_name = request.data.get('first_name')
            last_name = request.data.get('last_name')
            cedula = request.data.get('cedula')
            password1 = request.data.get('password1')
            password2 = request.data.get('password2')
            direccion = request.data.get('direccion')
            telefono = request.data.get('telefono')
            rol_nombre = request.data.get('rol', {}).get('nombre')  # Get 'nombre' field from 'rol'

            # Debugging log statements
            logger.debug(f"Received data: {request.data}")
            logger.debug(f"Role name: {rol_nombre}")
            print(request.data)

            # Verifications
            if not all([username, email, first_name, last_name, cedula,
                        password1, password2, direccion, telefono, rol_nombre]):
                
                return Response(
                    {'message': 'Todos los campos son obligatorios'},
                    status=status.HTTP_400_BAD_REQUEST
                ) 
                
                

            # Check for unique constraints
            if Usuario.objects.filter(username=username).exists():
                return Response(
                    {'message': 'El nombre de usuario ya existe'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if Usuario.objects.filter(email=email).exists():
                return Response(
                    {'message': 'El email ya está registrado'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if Usuario.objects.filter(cedula=cedula).exists():
                return Response(
                    {'message': 'La cédula ya está registrada'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if password1 != password2:
                return Response(
                    {'message': 'Las contraseñas no coinciden'},
                    status=status.HTTP_400_BAD_REQUEST
                )

           
            # Get the role or create it if it doesn't exist
            try:
                rol = Rol.objects.get(nombre=rol_nombre)
            except Rol.DoesNotExist:
                logger.debug(f"Role '{rol_nombre}' not found, creating it.")
                rol = Rol.objects.create(
                    nombre=rol_nombre,
                    descripcion='Comprador'  # Default description for new role
                )

            # Create the user
            usuario = Usuario.objects.create(
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name,
                cedula=cedula,
                password=make_password(password1),
                direccion=direccion,
                telefono=telefono,
                rol=rol,
                is_active=False  # El usuario está inactivo hasta que confirme el correo
            )

            # Assign groups if provided
            groups_ids = request.data.get('groups', [])
            if groups_ids:
                try:
                    groups = Group.objects.filter(id__in=groups_ids)
                    usuario.groups.set(groups)
                except Group.DoesNotExist:
                    return Response(
                        {'message': 'Uno o más grupos no existen'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Get permissions associated with the user's groups
            permisos = usuario.get_group_permissions()

            # Enviar correo de confirmación
            try:
                current_site = get_current_site(request)
                mail_subject = "Activa tu cuenta de usuario"
                message = render_to_string('template_activate_account.html', {
                    'user': usuario,
                    'domain': current_site.domain,
                    'uid': urlsafe_base64_encode(force_bytes(usuario.pk)),
                    'token': account_activation_token.make_token(usuario),
                    'protocol': 'https' if request.is_secure() else 'http'
                })
                email = EmailMessage(mail_subject, message, to=[usuario.email])
                email.send()

            except Exception as e:
                return Response(
                    {'message': f'Usuario creado, pero ocurrió un error al enviar el correo: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            return Response({
                'message': 'Usuario creado exitosamente. Revisa tu correo para confirmar tu cuenta.',
                'user': {
                    'username': usuario.username,
                    'email': usuario.email,
                    'cedula': usuario.cedula,
                    'rol': usuario.rol.nombre,
                    'groups': [group.name for group in usuario.groups.all()],
                    'permissions': list(permisos)
                }
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            return Response(
                {'message': f'Error al crear el usuario: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ChangePasswordView(APIView):
    """
    Vista para cambiar la contraseña de un usuario autenticado.
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Cambiar la contraseña del usuario autenticado.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING, description='Nombre de usuario'),
                'current_password': openapi.Schema(type=openapi.TYPE_STRING, description='Contraseña actual'),
                'new_password': openapi.Schema(type=openapi.TYPE_STRING, description='Nueva contraseña'),
            },
            required=['username', 'current_password', 'new_password'],
        ),
        responses={
            200: "Contraseña actualizada exitosamente.",
            400: "Datos inválidos (por ejemplo, nueva contraseña igual a la actual).",
            401: "Contraseña actual incorrecta.",
            404: "Usuario no encontrado.",
        }
    )

    def post(self, request):
        username = request.data.get('username')
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not all([username, current_password, new_password]):
            return Response(
                {'message': 'Todos los campos son obligatorios'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = Usuario.objects.get(username=username)
        except Usuario.DoesNotExist:
            return Response(
                {'message': 'Usuario no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )

        if not check_password(current_password, user.password):
            return Response(
                {'message': 'La contraseña actual es incorrecta'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if current_password == new_password:
            return Response(
                {'message': 'La nueva contraseña no puede ser igual a la actual'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.password = make_password(new_password)
        user.save()

        return Response(
            {'message': 'Contraseña actualizada exitosamente'},
            status=status.HTTP_200_OK
        )
    
class LogoutView(APIView):
    """
    Vista para cerrar sesión e invalidar el token de refresco.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Extraer el refresh token del cuerpo de la solicitud
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response({'message': 'Se requiere un refresh token'}, status=status.HTTP_400_BAD_REQUEST)

            # Colocar el refresh token en la blacklist
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({'message': 'Cierre de sesión exitoso'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': f'Error al cerrar sesión: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

class RefreshTokenView(APIView):
    """
    Vista para refrescar el token de acceso usando el refresh token.
    """
    permission_classes = [AllowAny]
    @swagger_auto_schema(
        operation_description="Refresca el token de acceso usando el refresh token.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'refresh': openapi.Schema(type=openapi.TYPE_STRING, description='Refresh token'),
            },
            required=['refresh'],
        ),
        responses={
            200: openapi.Response(
                description="Token de acceso refrescado exitosamente",
                examples={
                    "application/json": {
                        "access": "ey... (nuevo access token)"
                    }
                },
            ),
            400: "Se requiere un refresh token válido.",
        }
    )

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'message': 'Se requiere un refresh token'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Crear un objeto RefreshToken con el refresh token recibido
            token = RefreshToken(refresh_token)
            # Generar un nuevo access token
            new_access_token = str(token.access_token)

            return Response({'access': new_access_token}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'message': f'Error al refrescar el token: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)


class AdminView(APIView):
    """
    Vista exclusiva para usuarios con permisos de administrador.
    """
    permission_classes = [IsAuthenticated, IsStaffUser]

    @swagger_auto_schema(
        operation_description="Obtener datos del usuario administrador.",
        responses={
            200: openapi.Response(
                description="Datos del administrador",
                examples={
                    "application/json": {
                        "message": "Bienvenido, Admin",
                        "user": {
                            "username": "admin_user",
                            "email": "admin@example.com",
                            "is_staff": True
                        }
                    }
                },
            )
        }
    )

    
    def get(self, request):
        return Response({
            'message': 'Bienvenido, Admin',
            'user': {
                'username': request.user.username,
                'email': request.user.email,
                'is_staff': request.user.is_staff
            }
        })

class CompradorView(APIView):
    """
    Vista exclusiva para compradores autenticados.
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Obtener datos del usuario comprador.",
        responses={
            200: openapi.Response(
                description="Datos del comprador",
                examples={
                    "application/json": {
                        "message": "Bienvenido, Comprador",
                        "user": {
                            "username": "buyer_user",
                            "email": "buyer@example.com",
                            "is_staff": False
                        }
                    }
                },
            )
        }
    )

    
    def get(self, request):
        return Response({
            'message': 'Bienvenido, Comprador',
            'user': {
                'username': request.user.username,
                'email': request.user.email,
                'is_staff': request.user.is_staff
            }
        })
    
class EmailAPIView(APIView):
    """
    Vista para enviar un correo electrónico.
    """
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Enviar un correo con un asunto y mensaje.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'subject': openapi.Schema(type=openapi.TYPE_STRING, description='Asunto del correo'),
                'message': openapi.Schema(type=openapi.TYPE_STRING, description='Cuerpo del correo'),
                'to_email': openapi.Schema(type=openapi.TYPE_STRING, description='Correo del destinatario'),
            },
            required=['subject', 'message', 'to_email'],
        ),
        responses={
            200: "Correo enviado exitosamente.",
            400: "Faltan campos obligatorios.",
        }
    )

    def post(self, request):
        subject = request.data.get('subject')
        message = request.data.get('message')
        from_email = settings.EMAIL_HOST_USER
        to_email = request.data.get('to_email')

        if not all([subject, message, from_email, to_email]):
            return Response(
                {'message': 'Todos los campos son obligatorios'},
                status=status.HTTP_400_BAD_REQUEST
            )

        send_mail(
            subject,
            message,
            from_email,
            [to_email]
        )

        return Response(
            {'message': 'Email enviado exitosamente'},
            status=status.HTTP_200_OK
        )
    
class activate(APIView):
    """
    Activar la cuenta de usuario mediante un enlace de confirmación.
    """
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Activar la cuenta del usuario con el token de confirmación.",
        manual_parameters=[
            openapi.Parameter('uidb64', openapi.IN_PATH, description="ID codificado del usuario", type=openapi.TYPE_STRING),
            openapi.Parameter('token', openapi.IN_PATH, description="Token de activación", type=openapi.TYPE_STRING),
        ],
        responses={
            200: "Cuenta activada exitosamente.",
            400: "El enlace de activación es inválido.",
        }
    )
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = Usuario.objects.get(pk=uid)
        except Exception as e:
            user = None

        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return  HttpResponseRedirect('https://ecommerce-project-frontend-rhra.onrender.com/auth/login-1')
        else:
             return HttpResponseRedirect("https://ecommerce-project-frontend-rhra.onrender.com/auth/error")
