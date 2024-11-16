from django.db import models
from .certificados import *
from django.contrib.auth.hashers import make_password


class User(models.Model):
    username = models.CharField(max_length = 30)
    nombre = models.CharField(max_length = 50)
    apellido = models.CharField(max_length = 50)
    edad = models.IntegerField()
    imagen_perfil = models.ImageField(upload_to = "profile_images", blank = True, null = True)
    password = models.CharField(null = False, blank = False, max_length = 40, default = "admin")

    def save(self, *args, **kwargs):
        # Hashear la contraseña antes de guardar el objeto
        if not self.password.startswith(('pbkdf2_sha256$', 'bcrypt', 'argon2')):
            self.password = make_password(self.password)  # Genera el hash de la contraseña
        super().save(*args, **kwargs)


    def __str__(self) -> str:
        return str(self.username) + " - " + self.nombre
    
    def getNombreCompleto(self):
        return self.nombre + self.apellido
    

class Tienda(models.Model):
    dueno = models.OneToOneField(User, on_delete = models.CASCADE, related_name = "tiendas")
    nombre = models.CharField(max_length = 200)
    ciudad = models.CharField(max_length = 100)
    direccion = models.CharField(max_length = 100)
    descripcion = models.TextField()

    def __str__(self) -> str:
        return str(self.id) + " - " + self.nombre



class Certificado(models.Model):
    usuario = models.OneToOneField(User, on_delete = models.CASCADE, related_name = "certificado")
    
    certificado_pem = models.TextField(blank=True, null=True)
    clave_privada_pem = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.certificado_pem or not self.clave_privada_pem:
            clave_privada = generar_clave_privada()
            certificado = generar_certificado(self.usuario.getNombreCompleto(), clave_privada)
            self.clave_privada_pem = exportar_clave_privada(clave_privada)
            self.certificado_pem = exportar_certificado(certificado)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return str(self.id) + " - " + self.usuario.getNombreCompleto()
