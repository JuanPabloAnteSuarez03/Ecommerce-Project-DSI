# Generated by Django 5.1.2 on 2024-10-23 07:25

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Categoria',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre_categoria', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Comprador',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='MetodoPago',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipo_pago', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Carrito',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_creacion', models.DateField()),
                ('comprador', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.comprador')),
            ],
        ),
        migrations.CreateModel(
            name='Pedido',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_pedido', models.DateField()),
                ('total', models.FloatField()),
                ('estado', models.BooleanField()),
                ('comprador', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.comprador')),
            ],
        ),
        migrations.CreateModel(
            name='Pago',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('monto', models.FloatField()),
                ('fecha_pago', models.DateField()),
                ('metodo_pago', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.metodopago')),
                ('pedido', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.pedido')),
            ],
        ),
        migrations.CreateModel(
            name='PerfilUsuario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('direccion', models.CharField(blank=True, max_length=255, null=True)),
                ('telefono', models.CharField(blank=True, max_length=20, null=True)),
                ('usuario', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='comprador',
            name='perfil',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='users.perfilusuario'),
        ),
        migrations.CreateModel(
            name='Producto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre_producto', models.CharField(max_length=100)),
                ('descripcion', models.TextField()),
                ('precio', models.DecimalField(decimal_places=2, max_digits=10)),
                ('stock', models.IntegerField()),
                ('categoria', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.categoria')),
            ],
        ),
        migrations.CreateModel(
            name='Incluye',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad', models.IntegerField()),
                ('pedido', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.pedido')),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.producto')),
            ],
        ),
        migrations.CreateModel(
            name='Contiene',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad', models.IntegerField()),
                ('carrito', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.carrito')),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.producto')),
            ],
        ),
        migrations.CreateModel(
            name='Vendedor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('perfil', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='users.perfilusuario')),
            ],
        ),
        migrations.AddField(
            model_name='producto',
            name='vendedor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.vendedor'),
        ),
    ]
