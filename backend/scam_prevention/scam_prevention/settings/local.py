from .base import *
import os


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'scam_prevention_db',
    }
}


MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR.child('media')


STATIC_URL = 'static/'


