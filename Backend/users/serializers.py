# serializers.py
from rest_framework import serializers
from .models import Usuario
from django.contrib.auth.models import Group

class UsuarioSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(
        queryset=Group.objects.all(),
        many=True,
        slug_field='name', 
        required=False,
    )

    class Meta:
        model = Usuario
        fields = ('id', 'username', 'email', 'first_name', 'last_name',
                  'cedula', 'direccion', 'telefono', 'rol', 'groups')
        extra_kwargs = {'password': {'write_only': True}} 

    def validate_username(self, value):
        if not value:
            raise serializers.ValidationError("El campo 'username' es obligatorio.")
        return value

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("El campo 'email' es obligatorio.")
        # Add additional email format validation if needed
        return value

    def validate_password(self, value):
        if not value:
            raise serializers.ValidationError("El campo 'password' es obligatorio.")
        return value

    def validate_telefono(self, value):
        if not value:
            raise serializers.ValidationError("El campo 'telefono' es obligatorio.")
        if not value.isdigit():
            raise serializers.ValidationError("El campo 'telefono' debe contener solo números.")
        return value

    def validate_cedula(self, value):
        if not value:
            raise serializers.ValidationError("El campo 'cedula' es obligatorio.")
        if not value.isdigit():
            raise serializers.ValidationError("El campo 'cedula' debe contener solo números.")
        return value