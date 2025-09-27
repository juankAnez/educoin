from rest_framework import status, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Group, StudentGroup
from users.models import User
from .serializers import GroupSerializer, StudentGroupSerializer, AddStudentToGroupSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_create_group_drf(request):
    """Crear grupo educativo con DRF"""
    if request.user.role == 'teacher':
        return Response({
            'message': 'Solo los profesores pueden crear grupos',
            'error': 'permission_denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    serializer = GroupSerializer(data=request.data)
    
    if serializer.is_valid():
        group = serializer.save(teacher=request.user)
        return Response({
            'message': 'Grupo creado exitosamente',
            'group': GroupSerializer(group).data
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'message': 'Error al crear grupo',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_teacher_groups_drf(request):
    """Obtener grupos del profesor con DRF"""
    if request.user.role != 'teacher':
        return Response({
            'message': 'Solo los profesores pueden ver sus grupos',
            'error': 'permission_denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    groups = Group.objects.filter(teacher=request.user).order_by('-created_at')
    serializer = GroupSerializer(groups, many=True)
    
    return Response({
        'message': 'Grupos obtenidos exitosamente',
        'groups': serializer.data,
        'count': groups.count()
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_add_student_to_group_drf(request):
    """Agregar estudiante a grupo con DRF"""
    if request.user.role != 'teacher':
        return Response({
            'message': 'Solo los profesores pueden agregar estudiantes',
            'error': 'permission_denied'
        }, status=status.HTTP_403_FORBIDDEN)
    
    serializer = AddStudentToGroupSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        student_email = serializer.validated_data['student_email']
        group_id = serializer.validated_data['group_id']
        
        # Obtener objetos
        student = User.objects.get(email=student_email)
        group = Group.objects.get(id=group_id)
        
        # Verificar si ya está en el grupo
        if StudentGroup.objects.filter(student=student, group=group).exists():
            return Response({
                'message': 'El estudiante ya está en este grupo',
                'error': 'already_exists'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Crear relación
        student_group = StudentGroup.objects.create(student=student, group=group)
        
        return Response({
            'message': 'Estudiante agregado exitosamente al grupo',
            'student_group': StudentGroupSerializer(student_group).data
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'message': 'Error al agregar estudiante',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_group_students_drf(request, group_id):
    """Obtener estudiantes de un grupo específico"""
    try:
        if request.user.role == 'teacher':
            group = Group.objects.get(id=group_id, teacher=request.user)
        else:
            # Estudiante puede ver solo grupos a los que pertenece
            group = Group.objects.get(id=group_id, studentgroup__student=request.user)
        
        students = StudentGroup.objects.filter(group=group).order_by('joined_at')
        serializer = StudentGroupSerializer(students, many=True)
        
        return Response({
            'message': 'Estudiantes obtenidos exitosamente',
            'group': GroupSerializer(group).data,
            'students': serializer.data,
            'count': students.count()
        }, status=status.HTTP_200_OK)
        
    except Group.DoesNotExist:
        return Response({
            'message': 'Grupo no encontrado o no autorizado',
            'error': 'not_found'
        }, status=status.HTTP_404_NOT_FOUND)

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Group.objects.all()
        elif user.role == 'docente':
            return Group.objects.filter(teacher=user)
        elif user.role == 'estudiante':
            return Group.objects.filter(student_groups__student=user)
        return Group.objects.none()

    def perform_create(self, serializer):
        # Solo docentes pueden crear grupos y se asignan como teacher
        if self.request.user.role == 'docente':
            serializer.save(teacher=self.request.user)

class StudentGroupViewSet(viewsets.ModelViewSet):
    queryset = StudentGroup.objects.all()
    serializer_class = StudentGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return StudentGroup.objects.all()
        elif user.role == 'docente':
            return StudentGroup.objects.filter(group__teacher=user)
        elif user.role == 'estudiante':
            return StudentGroup.objects.filter(student=user)
        return StudentGroup.objects.none()