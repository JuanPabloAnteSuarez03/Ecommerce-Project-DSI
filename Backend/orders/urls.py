# products/urls.py
from django.urls import path, include
from rest_framework import routers
from rest_framework.permissions import AllowAny
from . import views

router = routers.DefaultRouter()
router.register(r'pedidos', views.PedidoView, basename='pedidos')
router.register(r'detallePedidos', views.DetallePedidoView, basename='detallePedidos')
router.register(r'facturas', views.FacturaView, basename='facturas')

urlpatterns = [ 
    path('api/', include(router.urls)),
]
