from PIL import Image, ImageDraw, ImageFont
from django.conf import settings
import os

def generar_factura(pedido):
    # Ruta donde se guardará la factura
    factura_path = os.path.join(settings.MEDIA_ROOT, 'facturas', f'factura_{pedido.id}.png')

    # Crear una nueva imagen (A4 aproximado en píxeles)
    width, height = 800, 1200
    imagen = Image.new('RGB', (width, height), 'white')
    draw = ImageDraw.Draw(imagen)

    # Cargar fuente (asegúrate de tener una fuente ttf)
    font_path = os.path.join(settings.BASE_DIR, 'arial.ttf')  # Cambia a una ruta válida
    font = ImageFont.truetype(font_path, size=20)

    # Datos del pedido
    text = [
        f"Factura del Pedido #{pedido.id}",
        f"Fecha: {pedido.fecha_pedido.strftime('%d/%m/%Y')}",
        f"Usuario: {pedido.usuario.username}",
        f"Estado: {'Completado' if pedido.estado else 'Pendiente'}",
        f"Total: ${pedido.total:.2f}",
        "",
        "Detalles del Pedido:",
    ]
    y = 50
    for line in text:
        draw.text((50, y), line, fill='black', font=font)
        y += 30

    # Agregar detalles del pedido
    for detalle in pedido.detalles.all():
        detalle_text = f"{detalle.cantidad} x {detalle.producto.nombre_producto} @ ${detalle.precio_unitario:.2f} = ${detalle.subtotal:.2f}"
        draw.text((50, y), detalle_text, fill='black', font=font)
        y += 30

    # Guardar la imagen
    os.makedirs(os.path.dirname(factura_path), exist_ok=True)
    imagen.save(factura_path)

    return factura_path
