# Generated by Django 5.1.2 on 2024-12-12 15:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0006_alter_producto_imagen'),
    ]

    operations = [
        migrations.AlterField(
            model_name='producto',
            name='imagen',
            field=models.BinaryField(blank=True, help_text='Imagen del producto en formati binario (opcional)', null=True),
        ),
    ]
