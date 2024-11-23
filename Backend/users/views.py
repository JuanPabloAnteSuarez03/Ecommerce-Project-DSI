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




class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

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
    permission_classes = [AllowAny]

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
            rol_nombre = request.data.get('rol')
            groups_ids = request.data.get('groups', [])

            # Verificaciones
            if not all([username, email, first_name, last_name, cedula,
                        password1, password2, direccion, telefono, rol_nombre]):
                return Response(
                    {'message': 'Todos los campos son obligatorios'},
                    status=status.HTTP_400_BAD_REQUEST
                )

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

            # Obtener el rol
            try:
                rol = Rol.objects.get(nombre=rol_nombre)
            except Rol.DoesNotExist:
                return Response(
                    {'message': 'Rol no válido'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Crear el usuario
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

            # Asignar grupos
            if groups_ids:
                try:
                    groups = Group.objects.filter(id__in=groups_ids)
                    usuario.groups.set(groups)
                except Group.DoesNotExist:
                    return Response(
                        {'message': 'Uno o más grupos no existen'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Obtener permisos asociados a los grupos del usuario
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
            return Response(
                {'message': f'Error al crear el usuario: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )





class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

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

class AdminView(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]
    
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
    permission_classes = [IsAuthenticated]
    
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
    permission_classes = [AllowAny]

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
    permission_classes = [AllowAny]
    
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = Usuario.objects.get(pk=uid)
        except Exception as e:
            user = None

        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return Response(
                {'message': 'Cuenta activada exitosamente'},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'message': 'El enlace de activación es inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )
