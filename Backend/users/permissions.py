from rest_framework.permissions import BasePermission
from .models import Usuario, Rol
from functools import wraps
from django.http import JsonResponse

from rest_framework import permissions

class IsStaffUser(permissions.BasePermission):
    """
    Permiso personalizado que solo permite acceso a usuarios staff.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)
