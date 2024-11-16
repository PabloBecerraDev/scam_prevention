from django.urls import path
from .views import *



urlpatterns = [
    path('api/createUser/', crearUsuarios, name = 'crear_usuario'),
    path('api/getAllUsers/', getAllUsuarios, name = 'get_all_users'),
] 
