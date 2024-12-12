# Generated by Django 5.1.2 on 2024-12-12 05:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0003_productofavorito'),
    ]

    operations = [
        migrations.AlterField(
            model_name='producto',
            name='imagen',
            field=models.BinaryField(blank=True, help_text='Imagen del producto almacenada como binario (opcional)', null=True),
        ),
    ]
