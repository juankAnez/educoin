from django.contrib import admin
from .models import User

# Solo registramos User aquí (el resto va en sus respectivos admin.py)
admin.site.register(User)