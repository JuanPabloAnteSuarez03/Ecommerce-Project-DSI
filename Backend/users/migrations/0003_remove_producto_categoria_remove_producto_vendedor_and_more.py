# Generated by Django 5.1.2 on 2024-11-02 06:33

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0001_initial'),
        ('users', '0002_producto_imagen'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='producto',
            name='categoria',
        ),
        migrations.RemoveField(
            model_name='producto',
            name='vendedor',
        ),
        migrations.AlterField(
            model_name='contiene',
            name='producto',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='products.producto'),
        ),
        migrations.AlterField(
            model_name='incluye',
            name='producto',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='products.producto'),
        ),
        migrations.DeleteModel(
            name='Categoria',
        ),
        migrations.DeleteModel(
            name='Producto',
        ),
    ]
