from django.shortcuts import render

from django.http import JsonResponse
from applications.usuarios.serializers import*
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from applications.usuarios.models import *


@api_view(['POST'])
def crearUsuarios(request):
    # Creamos un nuevo serializador con los datos de la petición
    serializer = UserSerializer(data = request.data)
    
    # Verificamos si los datos son válidos según las reglas definidas en el serializador
    if serializer.is_valid():
        # Si los datos son válidos, creamos el usuario
        serializer.save()
        return Response({'message': 'Usuario creado con éxito.'}, status=status.HTTP_201_CREATED)
    
    # Si los datos no son válidos, respondemos con los errores de validación
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def getAllUsuarios(request):
    # Obtenemos todos los usuarios de la base de datos
    users = User.objects.all()

    # Creamos el serializador con la lista de usuarios (usamos many=True)
    serializer = UserSerializer(users, many=True)
    
    # Retornamos los datos serializados en la respuesta
    return Response(serializer.data, status=status.HTTP_200_OK)