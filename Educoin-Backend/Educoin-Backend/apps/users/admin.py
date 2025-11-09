from django.contrib import admin
from .models import User, Profile

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "username", "role", "is_active", "is_staff", "creado", "actualizado")
    search_fields = ("email", "username", "role")
    list_filter = ("role", "is_active", "is_staff")
    ordering = ("-creado",)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "telefono", "institucion", "creado", "actualizado")
    search_fields = ("user__email", "telefono", "institucion")
    ordering = ("-creado",)

