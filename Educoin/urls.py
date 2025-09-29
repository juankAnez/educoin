from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
    path('groups/', include('groups.urls')),
    path('coins/', include('coins.urls')),
    path('auctions/', include('auctions.urls')),
    path('notifications/', include('notifications.urls')),
    path('reports/', include('reports.urls')),
]