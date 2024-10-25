# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Usuario
from .serializers import UsuarioSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdmin, IsVendedor, IsComprador
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Usuario, Rol
from django.db import IntegrityError
from django.contrib.auth.hashers import check_password
from django.http import JsonResponse
import json
from django.contrib.auth.hashers import make_password




class UsuarioList(APIView):
    def get(self, request):
        usuarios = Usuario.objects.all()
        serializer = UsuarioSerializer(usuarios, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
def LoginView(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Analiza los datos JSON
            username = data.get('username')
            password = data.get('password')
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Formato JSON no válido'}, status=400)

        if not username or not password:
            return JsonResponse({'message': 'Se requieren username y password'}, status=400)

        try:
            user = Usuario.objects.get(username=username)
        except Usuario.DoesNotExist:
            return JsonResponse({'message': 'Credenciales inválidas'}, status=401)

        if check_password(password, user.password):
            user_data = UsuarioSerializer(user).data
            return JsonResponse({'message': 'Login exitoso', 'user': user_data})
        else:
            return JsonResponse({'message': 'Credenciales inválidas'}, status=401)

    return JsonResponse({'message': 'Método no permitido'}, status=405)


@csrf_exempt
def SignUpView(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Analiza los datos JSON
            username = data.get('username')
            nombre = data.get('nombre')
            apellido = data.get('apellido')
            cedula = data.get('cedula')
            correo = data.get('correo')
            password1 = data.get('password1')
            password2 = data.get('password2')
            direccion = data.get('direccion')
            telefono = data.get('telefono')
            rol_nombre = data.get('rol')  # Asumiendo que se envía el nombre del rol
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Formato JSON no válido'}, status=400)

        # Verifica que todos los campos requeridos estén presentes
        if not all([username, nombre, apellido, cedula, correo, password1, password2, direccion, telefono, rol_nombre]):
            return JsonResponse({'message': 'Todos los campos son obligatorios'}, status=400)

        # Verifica que el usuario no exista ya
        if Usuario.objects.filter(username=username).exists():
            return JsonResponse({'message': 'El nombre de usuario ya existe'}, status=400)

        if Usuario.objects.filter(correo=correo).exists():
            return JsonResponse({'message': 'El correo ya está registrado'}, status=400)
        
        if Usuario.objects.filter(cedula=cedula).exists():
            return JsonResponse({'message': 'La cédula ya está registrada'}, status=400)
        
        if password1 != password2:
            return JsonResponse({'message': 'Las contraseñas no coinciden'}, status=400)
        
        password = password1  # Asigna password1 a password ya que ambas coinciden

        # Intenta obtener la instancia de Rol
        try:
            rol = Rol.objects.get(nombre=rol_nombre)
        except Rol.DoesNotExist:
            return JsonResponse({'message': 'Rol no válido'}, status=400)

        # Hashea la contraseña
        hashed_password = make_password(password)

        # Crea el nuevo usuario
        try:
            usuario = Usuario.objects.create(
                username=username,
                nombre=nombre,
                apellido=apellido,
                cedula=cedula,
                correo=correo,
                password=hashed_password,
                direccion=direccion,
                telefono=telefono,
                rol=rol  # Asigna la instancia del rol
            )
            usuario.save()
        except Exception as e:
            return JsonResponse({'message': f'Error al crear el usuario: {str(e)}'}, status=500)

        return JsonResponse({'message': 'Usuario creado exitosamente'}, status=201)

    return JsonResponse({'message': 'Método no permitido'}, status=405)

@csrf_exempt
def ChangePasswordView(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Analiza los datos JSON
            username = data.get('username')
            current_password = data.get('current_password')
            new_password = data.get('new_password')
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Formato JSON no válido'}, status=400)

        # Verifica que todos los campos requeridos estén presentes
        if not all([username, current_password, new_password]):
            return JsonResponse({'message': 'Todos los campos son obligatorios'}, status=400)

        try:
            # Busca al usuario en la base de datos
            user = Usuario.objects.get(username=username)
        except Usuario.DoesNotExist:
            return JsonResponse({'message': 'Usuario no encontrado'}, status=404)

        # Verifica la contraseña actual
        if not check_password(current_password, user.password):
            return JsonResponse({'message': 'La contraseña actual es incorrecta'}, status=401)

        # Verifica que la nueva contraseña sea diferente de la actual
        if current_password == new_password:
            return JsonResponse({'message': 'La nueva contraseña no puede ser igual a la actual'}, status=400)

        # Realiza el hashing de la nueva contraseña
        hashed_password = make_password(new_password)

        # Actualiza la contraseña del usuario
        user.password = hashed_password
        user.save()

        return JsonResponse({'message': 'Contraseña actualizada exitosamente'}, status=200)

    return JsonResponse({'message': 'Método no permitido'}, status=405)

    
class AdminView(APIView):
    """Vista que solo puede ser accedida por usuarios con rol admin."""
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        return Response({"message": "Bienvenido, administrador"})
    
    def post(self, request):
        return Response({"message": "Bienvenido, administrador"})
    
    def put(self, request): 
        return Response({"message": "Bienvenido, administrador"})
    
    def delete(self, request): 
        return Response({"message": "Bienvenido, administrador"})

class CompradorView(APIView):
    """Vista que solo puede ser accedida por usuarios con rol comprador."""
    permission_classes = [IsAuthenticated, IsComprador]

    def get(self, request):
        return Response({"message": "Bienvenido, comprador"})
    
    def post(self, request):
        return Response({"message": "Bienvenido, comprador"})
    
    def put(self, request): 
        return Response({"message": "Bienvenido, comprador"})
    
    def delete(self, request): 
        return Response({"message": "Bienvenido, comprador"})

class VendedorView(APIView):
    """Vista que solo puede ser accedida por usuarios con rol vendedor."""
    permission_classes = [IsAuthenticated, IsVendedor]

    def get(self, request):
        return Response({"message": "Bienvenido, vendedor"})
    
    def post(self, request):
        return Response({"message": "Bienvenido, vendedor"})
    
    def put(self, request): 
        return Response({"message": "Bienvenido, vendedor"})
    
    def delete(self, request): 
        return Response({"message": "Bienvenido, vendedor"})