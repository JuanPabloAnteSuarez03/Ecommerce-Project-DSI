# serializers.py
from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                 'cedula', 'direccion', 'telefono', 'rol')
        extra_kwargs = {'password': {'write_only': True}}