# serializers.py
from rest_framework import serializers
from .models import Usuario
from django.contrib.auth.models import Group

class UsuarioSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(
        queryset=Group.objects.all(),
        many=True,
        slug_field='name'
    )

    class Meta:
        model = Usuario
        fields = ('id', 'username', 'email', 'first_name', 'last_name',
                  'cedula', 'direccion', 'telefono', 'rol', 'groups')
        extra_kwargs = {'password': {'write_only': True}}