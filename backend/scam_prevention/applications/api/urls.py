from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *



urlpatterns = [
    #urls tokens
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),


    path('api/createUser/', crearUsuarios, name = 'crear_usuario'),
    path('api/getAllUsers/', getAllUsuarios, name = 'get_all_users'),
    path('api/login/', login, name='login'),
    path('api/obtener_usuario_logueado/', obtener_usuario_logueado, name='usuario_logueado'),
    path('api/hasTienda/', getTiendaUsuLogeado, name='getTiendaUsuLogeado'),
    path('api/createTienda/', crear_tienda, name='crear_tienda'),

] 
