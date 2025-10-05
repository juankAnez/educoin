from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from django.db import transaction
from apps.grades.models import Grade
from apps.coins.models import CoinTransaction, Wallet, Period
from .models import Activity, Submission
from .serializers import ActivitySerializer, SubmissionSerializer
from apps.users.permissions import IsDocente


class ActivityViewSet(viewsets.ModelViewSet):
    """
    - Docentes pueden crear/editar actividades en sus clases.
    - Estudiantes solo ven actividades habilitadas de sus grupos.
    """
    serializer_class = ActivitySerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'docente':
            return Activity.objects.filter(group__classroom__docente=user)
        elif user.role == 'estudiante':
            return Activity.objects.filter(group__estudiantes=user, habilitada=True)
        return Activity.objects.none()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsDocente]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        group = serializer.validated_data.get('group')
        if group.classroom.docente != self.request.user:
            raise PermissionDenied("No puedes crear actividades en grupos que no te pertenecen.")
        serializer.save()


class SubmissionViewSet(viewsets.ModelViewSet):
    """
    Vista para manejar las entregas de los estudiantes.
    Los docentes pueden calificarlas y generar monedas automáticamente.
    """
    queryset = Submission.objects.all().select_related("activity", "estudiante")
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != "estudiante":
            raise PermissionDenied("Solo los estudiantes pueden enviar actividades.")
        serializer.save(estudiante=user)

    @action(detail=True, methods=["patch"], url_path="grade")
    @transaction.atomic
    def grade_submission(self, request, pk=None):
        """
        Califica una entrega y:
        - Actualiza o crea la nota en Grade.
        - Asigna Educoins según el rendimiento.
        """
        submission = self.get_object()
        user = request.user

        if user.role != "docente":
            raise PermissionDenied("Solo los docentes pueden calificar entregas.")

        nota = request.data.get("nota")
        retro = request.data.get("retroalimentacion", "")

        if nota is None:
            return Response({"error": "Debes incluir una calificación."}, status=status.HTTP_400_BAD_REQUEST)

        # --- 1. Actualizar submission ---
        submission.calificacion = nota
        submission.retroalimentacion = retro
        submission.save()

        # --- 2. Crear o actualizar Grade ---
        grade, created = Grade.objects.update_or_create(
            activity=submission.activity,
            student=submission.estudiante,
            defaults={"nota": nota, "retroalimentacion": retro}
        )

        # --- 3. Educoins ---
        activity = submission.activity
        periodo = Period.objects.filter(activo=True).first()

        if periodo:
            wallet, _ = Wallet.objects.get_or_create(
                usuario=submission.estudiante,
                grupo=activity.group,
                periodo=periodo,
                defaults={"saldo": 0, "bloqueado": 0}
            )

            coins_ganados = int(float(nota) / 5.0 * activity.valor_educoins)

            # Bonus adicional si la nota ≥ 4.5
            if float(nota) >= 4.5:
                coins_ganados += int(activity.valor_educoins * 0.05)

            if coins_ganados > 0:
                wallet.saldo += coins_ganados
                wallet.save()

                CoinTransaction.objects.create(
                    wallet=wallet,
                    tipo="earn",
                    cantidad=coins_ganados,
                    descripcion=f"Monedas ganadas por '{activity.nombre}' (nota {nota})"
                )

        # --- 4. Respuesta final ---
        return Response({
            "mensaje": "Entrega calificada correctamente",
            "submission_id": submission.id,
            "nota": submission.calificacion,
            "retroalimentacion": submission.retroalimentacion,
            "grade_id": grade.id,
            "coins_ganados": coins_ganados if periodo else 0,
            "wallet_saldo": wallet.saldo if periodo else None
        }, status=status.HTTP_200_OK)
