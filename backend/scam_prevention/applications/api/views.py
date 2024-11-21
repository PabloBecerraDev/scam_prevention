from django.shortcuts import render

from django.http import JsonResponse
from applications.usuarios.serializers import*
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from applications.usuarios.models import *
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated





@api_view(['POST'])
def crearUsuarios(request):
     # Extraemos los datos de la solicitud
    data = request.data.copy()  # Hacemos una copia para poder modificarla

    # Modificamos los datos antes de pasarlos al serializador
    data['is_active'] = True  # Establecemos is_active a True
    data['password'] = make_password(data['password'])  # Hasheamos la contraseña

    # Creamos un nuevo serializador con los datos modificados
    serializer = UserSerializer(data=data)
    
    # Verificamos si los datos son validos según las reglas definidas en el serializador
    if serializer.is_valid():
        # Si los datos son válidos, creamos el usuario
        serializer.save()
        return Response({'message': 'Usuario creado con exito.'}, status=status.HTTP_201_CREATED)
    
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



@api_view(['POST'])
@permission_classes([AllowAny])
def crear_user(request):
    print("aaa")
    data = request.data

    try:
        print("aaa")
        # Crear un usuario utilizando los datos recibidos
        usuario = User(
            username=data['username'],
            nombre=data['nombre'],
            apellido=data['apellido'],
            edad=data['edad'],
            imagen_perfil=data.get('imagen_perfil'),  # Usar get para evitar KeyError
        )
        # Establecer la contraseña correctamente
        usuario.set_password(data['password'])
        usuario.save()

        # Serializar el usuario creado
        serializer = UserSerializer(usuario)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except KeyError as e:
        return Response(
            {"error": f"Falta el campo requerido: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    except Exception as e:
        return Response(
            {"error": "Ocurrió un error al crear el usuario.", "detalles": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    

# Endpoint para el login
@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    
    if user:
        # Si el usuario existe y las credenciales son correctas, generamos el token
        from rest_framework_simplejwt.tokens import RefreshToken
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),  # Token de acceso
            'refresh': str(refresh),  # Token de refresco
        }, status=status.HTTP_200_OK)
    else:
        return Response({'detail': 'Credenciales incorrectas'}, status=status.HTTP_401_UNAUTHORIZED)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_usuario_logueado(request):
    user = request.user
    return Response({
        'username': user.username,
        'nombre': user.first_name,
        'apellido': user.last_name,
        'edad': user.profile.age if hasattr(user, 'profile') else None,
        'imagen_perfil': user.profile.image.url if hasattr(user, 'profile') and user.profile.image else None
    })