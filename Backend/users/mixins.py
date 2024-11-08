from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import PermissionDenied

class StaffRequiredMixin:
    """
    Mixin que verifica si el usuario es staff antes de procesar cualquier request.
    Para usar con vistas basadas en clases de Django REST Framework.
    """
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response(
                {'message': 'Autenticación requerida'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        if not request.user.is_staff:
            return Response(
                {'message': 'Se requieren permisos de staff para esta acción'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().dispatch(request, *args, **kwargs)
