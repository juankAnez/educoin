from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models
from apps.groups.models import Group
from apps.coins.models import Wallet
from apps.activities.models import Activity
from .models import Grade
from .serializers import GradeSerializer


class GradeViewSet(viewsets.ModelViewSet):
    """
    Vista de gestión de calificaciones (grades).
    - Los docentes pueden ver y generar reportes de sus grupos.
    - Los estudiantes solo pueden ver sus propias notas.
    """
    queryset = Grade.objects.all().select_related("activity", "student")
    serializer_class = GradeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "estudiante":
            return Grade.objects.filter(student=user)
        elif user.role == "docente":
            return Grade.objects.filter(activity__group__classroom__docente=user)
        return Grade.objects.none()

    @action(detail=False, methods=["get"], url_path="group/(?P<group_id>[^/.]+)/report")
    def group_report(self, request, group_id=None):
        """
        Genera un reporte completo de notas y educoins por grupo.
        """
        try:
            group = Group.objects.get(pk=group_id)
        except Group.DoesNotExist:
            return Response({"detail": "Grupo no encontrado."}, status=404)

        estudiantes = group.estudiantes.all()
        data = []

        for est in estudiantes:
            grades = Grade.objects.filter(student=est, activity__group=group)
            promedio = grades.aggregate(models.Avg("nota"))["nota__avg"] or 0

            wallet = Wallet.objects.filter(usuario=est, grupo=group).order_by("-creado").first()
            saldo = wallet.saldo if wallet else 0

            detalles = [
                {
                    "activity": g.activity.nombre,
                    "nota": g.nota,
                    "educoins_ganados": g.calcular_coins_ganados() if hasattr(g, "calcular_coins_ganados") else 0,
                }
                for g in grades
            ]

            data.append({
                "student_id": est.id,
                "student_name": f"{est.first_name} {est.last_name}",
                "student_email": est.email,
                "promedio_nota": round(promedio, 2),
                "total_educoins": saldo,
                "detalles": detalles,
            })

        return Response(data)
