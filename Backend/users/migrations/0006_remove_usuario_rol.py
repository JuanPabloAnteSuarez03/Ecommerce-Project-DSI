# Generated by Django 5.1.2 on 2024-12-07 03:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_remove_pedido_usuario_alter_incluye_pedido_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usuario',
            name='rol',
        ),
    ]
