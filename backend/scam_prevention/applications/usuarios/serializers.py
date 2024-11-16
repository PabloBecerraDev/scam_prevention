from rest_framework import serializers
from .models import Certificado, User, Tienda


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'nombre', 'apellido', 'edad', 'imagen_perfil', 'password']

    def create(self, validated_data):
        """
        Crea y devuelve un nuevo usuario, asegurándose de que la contraseña esté correctamente cifrada.
        """
        password = validated_data.get('password')
        user = User(**validated_data)
        user.set_password(password)  # Hashea la contraseña antes de guardarla
        user.save()
        return user

    def update(self, instance, validated_data):
        """
        Actualiza la información de un usuario, asegurando que la contraseña esté correctamente cifrada si es cambiada.
        """
        password = validated_data.get('password')
        if password:
            instance.set_password(password)
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.apellido = validated_data.get('apellido', instance.apellido)
        instance.edad = validated_data.get('edad', instance.edad)
        instance.imagen_perfil = validated_data.get('imagen_perfil', instance.imagen_perfil)
        instance.save()
        return instance
    


class TiendaSerializer(serializers.ModelSerializer):
    dueno = UserSerializer()  # Se incluye el serializador de User para la relación

    class Meta:
        model = Tienda
        fields = ['dueno', 'nombre', 'ciudad', 'direccion', 'descripcion']

    def create(self, validated_data):
        """
        Crea y devuelve una nueva tienda. El campo `dueno` se crea con el serializador del modelo User.
        """
        dueno_data = validated_data.pop('dueno')  # Se extrae la información del dueño (User)
        dueno = User.objects.create(**dueno_data)  # Se crea el User si no existe
        tienda = Tienda.objects.create(dueno=dueno, **validated_data)
        return tienda

    def update(self, instance, validated_data):
        """
        Actualiza la información de una tienda.
        """
        dueno_data = validated_data.get('dueno')
        if dueno_data:
            instance.dueno.nombre = dueno_data.get('nombre', instance.dueno.nombre)
            instance.dueno.apellido = dueno_data.get('apellido', instance.dueno.apellido)
            instance.dueno.save()
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.ciudad = validated_data.get('ciudad', instance.ciudad)
        instance.direccion = validated_data.get('direccion', instance.direccion)
        instance.descripcion = validated_data.get('descripcion', instance.descripcion)
        instance.save()
        return instance
    
    def delete(self, instance, validated_data):
        pass
    

class CertificadoSerializer(serializers.ModelSerializer):
    usuario = UserSerializer()  # Relación con el modelo `User`

    class Meta:
        model = Certificado
        fields = ['usuario', 'certificado_pem', 'clave_privada_pem']

    def create(self, validated_data):
        """
        Crea y devuelve un nuevo certificado para un usuario. Este método puede incluir la lógica de
        generación de claves y certificados, si fuera necesario.
        """
        usuario_data = validated_data.pop('usuario')  # Se extrae la información del usuario
        usuario = User.objects.create(**usuario_data)  # Crear o obtener el usuario
        certificado = Certificado.objects.create(usuario=usuario, **validated_data)
        return certificado

    def update(self, instance, validated_data):
        """
        Actualiza la información de un certificado.
        """
        usuario_data = validated_data.get('usuario')
        if usuario_data:
            instance.usuario.nombre = usuario_data.get('nombre', instance.usuario.nombre)
            instance.usuario.apellido = usuario_data.get('apellido', instance.usuario.apellido)
            instance.usuario.save()
        instance.certificado_pem = validated_data.get('certificado_pem', instance.certificado_pem)
        instance.clave_privada_pem = validated_data.get('clave_privada_pem', instance.clave_privada_pem)
        instance.save()
        return instance