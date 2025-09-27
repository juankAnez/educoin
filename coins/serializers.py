from rest_framework import serializers
from .models import EducoinWallet, EducoinTransaction
from users.models import User
from groups.models import Group

class EducoinWalletSerializer(serializers.ModelSerializer):
    """Serializer para billeteras de Educoins"""
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    student_email = serializers.CharField(source='student.email', read_only=True)
    group_name = serializers.CharField(source='group.name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = EducoinWallet
        fields = ['id', 'student', 'group', 'balance', 'student_name', 
                 'student_email', 'group_name', 'user_email', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class EducoinTransactionSerializer(serializers.ModelSerializer):
    """Serializer para transacciones de Educoins"""
    wallet_owner = serializers.CharField(source='wallet.student.get_full_name', read_only=True)
    wallet_group = serializers.CharField(source='wallet.group.name', read_only=True)
    wallet_user_email = serializers.CharField(source='wallet.user.email', read_only=True)
    performed_by_email = serializers.CharField(source='performed_by.email', read_only=True)
    
    class Meta:
        model = EducoinTransaction
        fields = ['id', 'wallet', 'amount', 'transaction_type', 'description',
                 'wallet_owner', 'wallet_group', 'wallet_user_email', 'created_at', 'performed_by', 'performed_by_email']
        read_only_fields = ['id', 'created_at', 'wallet_user_email', 'performed_by_email']

class AwardEducoinsSerializer(serializers.Serializer):
    """Serializer para otorgar Educoins"""
    student_email = serializers.EmailField()
    group_id = serializers.IntegerField()
    amount = serializers.IntegerField(min_value=1, max_value=1000)
    description = serializers.CharField(max_length=255)
    
    def validate_student_email(self, value):
        """Validar que el estudiante exista"""
        try:
            student = User.objects.get(email=value, role='student')
            return value
        except User.DoesNotExist:
            raise serializers.ValidationError("Estudiante no encontrado")
    
    def validate_group_id(self, value):
        """Validar que el grupo exista y pertenezca al profesor"""
        request = self.context.get('request')
        try:
            group = Group.objects.get(id=value, teacher=request.user)
            return value
        except Group.DoesNotExist:
            raise serializers.ValidationError("Grupo no encontrado o no autorizado")
    
    def validate(self, data):
        """Validar que el estudiante esté en el grupo"""
        from groups.models import StudentGroup
        
        student = User.objects.get(email=data['student_email'])
        group = Group.objects.get(id=data['group_id'])
        
        if not StudentGroup.objects.filter(student=student, group=group).exists():
            raise serializers.ValidationError("El estudiante no pertenece a este grupo")
        
        return data