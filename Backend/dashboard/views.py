from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsStaffUser
from orders.models import Pedido, DetallePedido
from products.models import Producto
from users.models import Usuario
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class DashboardData(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]
    
    @swagger_auto_schema(
        operation_description="Obtiene datos del dashboard con ventas totales, cantidad de pedidos, productos más vendidos, usuarios registrados y stock actual.",
        responses={
            200: openapi.Response(
                description="Datos del dashboard",
                examples={
                    'application/json': {
                        "total_ventas": 15000.75,
                        "total_pedidos": 150,
                        "productos_mas_vendidos": [
                            {"producto__nombre_producto": "Producto 1", "total_vendido": 100},
                            {"producto__nombre_producto": "Producto 2", "total_vendido": 75}
                        ],
                        "usuarios_registrados": 500,
                        "productos_stock": [
                            {"nombre_producto": "Producto 1", "stock": 50},
                            {"nombre_producto": "Producto 2", "stock": 30}
                        ]
                    }
                }
            )
        }
    )
    def get(self, request):
        """
        Este método obtiene los datos estadísticos del dashboard, como:
        - Total de ventas
        - Total de pedidos
        - Productos más vendidos (Top 5)
        - Número total de usuarios registrados
        - Stock de productos disponibles
        """
        # Ventas totales
        total_ventas = Pedido.objects.filter(estado=True).aggregate(total=Sum('total'))['total'] or 0
        
        # Cantidad de pedidos realizados
        total_pedidos = Pedido.objects.filter(estado=True).count()
        
        # Productos más vendidos (top 5)
        productos_mas_vendidos = (
            DetallePedido.objects.values('producto__nombre_producto')
            .annotate(total_vendido=Sum('cantidad'))
            .order_by('-total_vendido')[:5]
        )

        # Usuarios registrados
        usuarios_registrados = Usuario.objects.count()
        
        # Stock actual por producto
        productos_stock = Producto.objects.values('nombre_producto', 'stock')

        return Response({
            "total_ventas": total_ventas,
            "total_pedidos": total_pedidos,
            "productos_mas_vendidos": list(productos_mas_vendidos),
            "usuarios_registrados": usuarios_registrados,
            "productos_stock": list(productos_stock)
        })
