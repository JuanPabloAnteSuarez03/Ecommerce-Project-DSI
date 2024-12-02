# Generated by Django 5.1.2 on 2024-11-25 03:42

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0001_initial'),
        ('users', '0004_remove_contiene_carrito_remove_contiene_producto_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pedido',
            name='usuario',
        ),
        migrations.AlterField(
            model_name='incluye',
            name='pedido',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='orders.pedido'),
        ),
        migrations.AlterField(
            model_name='pago',
            name='pedido',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='orders.pedido'),
        ),
        migrations.DeleteModel(
            name='Factura',
        ),
        migrations.DeleteModel(
            name='Pedido',
        ),
    ]