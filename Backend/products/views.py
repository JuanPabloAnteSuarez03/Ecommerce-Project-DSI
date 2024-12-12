# views.py
from rest_framework import viewsets
from .models import Producto, Categoria, ProductoFavorito
from .serializer import ProductoSerializer, CategorySerializer, ProductoFavoritoSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from users.permissions import IsStaffUser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.permissions import DjangoModelPermissions
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
class CategoriaView(viewsets.ModelViewSet):
    """
    API endpoint para gestionar categorías de productos.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    queryset = Categoria.objects.all()
    serializer_class = CategorySerializer

    @swagger_auto_schema(
        operation_description="Obtener una lista de todas las categorías.",
        responses={200: CategorySerializer(many=True)},
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Crear una nueva categoría.",
        request_body=CategorySerializer,
        responses={201: CategorySerializer},
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Obtener detalles de una categoría específica.",
        responses={200: CategorySerializer},
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Actualizar una categoría existente.",
        request_body=CategorySerializer,
        responses={200: CategorySerializer},
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Eliminar una categoría.",
        responses={204: "No Content"},
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class ProductoView(viewsets.ModelViewSet):
    """
    API endpoint para gestionar productos.
    """
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

    queryset = Producto.objects.all()
    parser_classes = (MultiPartParser, FormParser)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @swagger_auto_schema(
        operation_description="Obtener una lista de todos los productos.",
        responses={200: ProductoSerializer(many=True)},
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Crear un nuevo producto.",
        request_body=ProductoSerializer,
        responses={201: ProductoSerializer},
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Obtener detalles de un producto específico.",
        responses={200: ProductoSerializer},
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Actualizar un producto existente.",
        request_body=ProductoSerializer,
        responses={200: ProductoSerializer},
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Eliminar un producto.",
        responses={204: "No Content"},
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
 
 
class ProductoFavoritoView(viewsets.ModelViewSet):
    """
    API endpoint for managing user's favorite products.

    This viewset provides a complete set of CRUD operations for user-specific 
    favorite products, with authentication as the primary access control.

    Key Features:
    - Only authenticated users can access
    - Users can only see and manage their own favorite products
    - Automatically associates the current user with created favorites
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ProductoFavoritoSerializer

    def get_queryset(self):
        """
        Override to return only the current user's favorite products.
        
        Returns:
            QuerySet of ProductoFavorito instances belonging to the current user
        """
        return ProductoFavorito.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        """
        Override to automatically set the user when creating a favorite product.
        
        Args:
            serializer (ProductoFavoritoSerializer): Serializer instance
        """
        serializer.save(usuario=self.request.user)

    @swagger_auto_schema(
        operation_description="List all favorite products for the authenticated user.",
        operation_summary="Retrieve user's favorite products",
        responses={
            200: openapi.Response(
                description="Successful retrieval of favorite products",
                schema=ProductoFavoritoSerializer(many=True)
            ),
            401: "Unauthorized - Authentication required"
        },
        tags=['Favorite Products']
    )
    def list(self, request, *args, **kwargs):
        """
        List all favorite products for the current user.
        
        Returns a list of favorite products associated with the authenticated user.
        """
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Add a new product to user's favorites.",
        operation_summary="Create a new favorite product",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'producto': openapi.Schema(
                    type=openapi.TYPE_INTEGER, 
                    description="ID of the product to add to favorites"
                )
            },
            required=['producto']
        ),
        responses={
            201: openapi.Response(
                description="Favorite product successfully created",
                schema=ProductoFavoritoSerializer
            ),
            400: "Bad Request - Invalid product ID",
            401: "Unauthorized - Authentication required"
        },
        tags=['Favorite Products']
    )
    def create(self, request, *args, **kwargs):
        """
        Create a new favorite product for the current user.
        
        Requires a valid product ID in the request body.
        Automatically associates the current user with the favorite.
        """
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Retrieve details of a specific favorite product.",
        operation_summary="Get favorite product details",
        responses={
            200: openapi.Response(
                description="Successful retrieval of favorite product details",
                schema=ProductoFavoritoSerializer
            ),
            401: "Unauthorized - Authentication required",
            404: "Not Found - Favorite product does not exist"
        },
        tags=['Favorite Products']
    )
    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve details of a specific favorite product.
        
        Only allows access to the user's own favorite products.
        """
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Update an existing favorite product.",
        operation_summary="Modify favorite product",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'producto': openapi.Schema(
                    type=openapi.TYPE_INTEGER, 
                    description="ID of the product to update in favorites"
                )
            }
        ),
        responses={
            200: openapi.Response(
                description="Favorite product successfully updated",
                schema=ProductoFavoritoSerializer
            ),
            400: "Bad Request - Invalid product ID",
            401: "Unauthorized - Authentication required",
            404: "Not Found - Favorite product does not exist"
        },
        tags=['Favorite Products']
    )
    def update(self, request, *args, **kwargs):
        """
        Update an existing favorite product.
        
        Allows changing the product associated with a favorite.
        Only the product can be modified, not the user or timestamp.
        """
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Remove a product from user's favorites.",
        operation_summary="Delete favorite product",
        responses={
            204: "Favorite product successfully deleted",
            401: "Unauthorized - Authentication required",
            404: "Not Found - Favorite product does not exist"
        },
        tags=['Favorite Products']
    )
    def destroy(self, request, *args, **kwargs):
        """
        Remove a favorite product from the user's list.
        
        Permanently deletes the specified favorite product.
        """
        return super().destroy(request, *args, **kwargs)