from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class IsDocente(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'docente'

class IsEstudiante(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'estudiante'

class AdminOrDocentePermission(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'docente']

class AdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.role == 'admin'
