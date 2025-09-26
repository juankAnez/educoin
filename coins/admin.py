from django.contrib import admin
from .models import EducoinWallet, EducoinTransaction

admin.site.register(EducoinWallet)
admin.site.register(EducoinTransaction)