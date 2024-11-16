from cryptography import x509
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.x509.oid import NameOID
from datetime import datetime, timedelta


def generar_clave_privada():
    """
    Genera una clave privada RSA.
    """
    return rsa.generate_private_key(public_exponent=65537, key_size=2048)


def generar_certificado(nombre_comun, clave_privada, dias_validez=365):
    """
    Genera un certificado X.509 autofirmado.
    
    :param nombre_comun: Nombre común del certificado (Common Name).
    :param clave_privada: Clave privada asociada.
    :param dias_validez: Días de validez del certificado.
    :return: Certificado en formato X.509.
    """
    subject = issuer = x509.Name([
        x509.NameAttribute(NameOID.COMMON_NAME, nombre_comun),
    ])
    
    certificado = (
        x509.CertificateBuilder()
        .subject_name(subject)
        .issuer_name(issuer)
        .public_key(clave_privada.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(datetime.utcnow())
        .not_valid_after(datetime.utcnow() + timedelta(days=dias_validez))
        .sign(clave_privada, hashes.SHA256())
    )
    return certificado


def exportar_clave_privada(clave_privada):
    """
    Exporta la clave privada en formato PEM.
    """
    return clave_privada.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.TraditionalOpenSSL,
        encryption_algorithm=serialization.NoEncryption(),
    ).decode('utf-8')


def exportar_certificado(certificado):
    """
    Exporta el certificado en formato PEM.
    """
    return certificado.public_bytes(serialization.Encoding.PEM).decode('utf-8')
