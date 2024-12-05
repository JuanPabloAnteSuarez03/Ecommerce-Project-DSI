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
import logging 
from .models import Usuario, Rol

logger = logging.getLogger(__name__) 

from rest_framework.response import Response


class LoginView(APIView):
    permission_classes = [AllowAny]

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
        print("Request data:", request.data)
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Usuario creado exitosamente", "user": serializer.data}, status=201)
        print("Serializer errors:", serializer.errors)  # Log validation errors
        
        try:
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
                rol=rol
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

            return Response({
                'message': 'Usuario creado exitosamente',
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