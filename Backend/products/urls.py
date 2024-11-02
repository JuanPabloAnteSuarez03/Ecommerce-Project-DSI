# products/urls.py
from django.urls import path, include
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from rest_framework.permissions import AllowAny
from . import views

router = routers.DefaultRouter()
router.register(r'categorias', views.CategoriaView, basename='categoria')
router.register(r'productos', views.ProductoView, basename='producto')

urlpatterns = [ 
    path('api/', include(router.urls)),
    path('docs/', include_docs_urls(
        title='Products API',
        public=True,
        permission_classes=[AllowAny]
    ))
]
