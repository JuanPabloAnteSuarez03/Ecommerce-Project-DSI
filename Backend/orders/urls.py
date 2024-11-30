# products/urls.py
from django.urls import path, include
from rest_framework import routers
from rest_framework.permissions import AllowAny
from . import views
from django.conf import settings
from django.conf.urls.static import static

router = routers.DefaultRouter()
router.register(r'pedidos', views.PedidoView, basename='pedidos')
router.register(r'detallePedidos', views.DetallePedidoView, basename='detallePedidos')

urlpatterns = [ 
    path('api/', include(router.urls)),
    path('api/factura/<int:pedido_id>/', views.FacturaEmailAPIView.as_view(), name='factura-email'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
