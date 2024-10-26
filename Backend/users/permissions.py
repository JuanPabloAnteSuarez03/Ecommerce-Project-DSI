from rest_framework.permissions import BasePermission
from .models import Usuario, Rol
from functools import wraps
from django.http import JsonResponse

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.rol == 'admin'

class IsVendedor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.rol == 'vendedor'

class IsComprador(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.rol == 'comprador'


def admin_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        user = request.user
        if not user.is_authenticated:
            return JsonResponse({'message': 'No autenticado'}, status=401)
        
        # Verificar si el usuario tiene el rol de "Admin"
        if user.rol.nombre != "Admin":
            return JsonResponse({'message': 'Permiso denegado'}, status=403)
        
        return view_func(request, *args, **kwargs)
    return _wrapped_view