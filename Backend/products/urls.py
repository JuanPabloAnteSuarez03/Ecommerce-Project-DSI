# products/urls.py
from django.urls import path, include
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from rest_framework.permissions import AllowAny
from . import views

router = routers.DefaultRouter()
router.register(r'categorias', views.CategoriaView, basename='categoria')
router.register(r'productos', views.ProductoView, basename='producto')
router.register(r'favoritos', views.ProductoFavoritoView, basename='favoritos')


urlpatterns = [ 
    path('api/', include(router.urls)),

]
