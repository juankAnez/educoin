from django.contrib import admin
from django.urls import path, include

urlpatterns = [ 
    path('admin/', admin.site.urls), 
    path('api/users/', include('apps.users.urls')), 
    path('api/classrooms/', include('apps.classrooms.urls')), 
    path('api/groups/', include('apps.groups.urls')), 
    path('api/activities/', include('apps.activities.urls')), 
    path('api/grades/', include('apps.grades.urls')), 
    path('api/coins/', include('apps.coins.urls')), 
    path('api/auctions/', include('apps.auctions.urls')), 
]