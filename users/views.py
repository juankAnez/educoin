
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import models  # si ya lo tienes, déjalo
from users.models import User # si ya lo tienes, déjalo
import json
@csrf_exempt
def api_register(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'student')  # Por defecto estudiante

        if User.objects.filter(email=email).exists():
            return JsonResponse({"success": False, "error": "El correo ya está registrado"})

        user = User.objects.create_user(username=email, email=email, password=password, role=role)
        return JsonResponse({"success": True, "message": "Usuario creado con éxito", "username": user.username})
    

@csrf_exempt
def api_login(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        user = authenticate(username=email, password=password)
        if user:
            login(request, user)
            return JsonResponse({
                "success": True,
                "message": "Login exitoso",
                "username": user.username,
                "role": user.role
            })
        return JsonResponse({"success": False, "error": "Credenciales incorrectas"})
    

from django.utils import timezone
from groups.models import Group, StudentGroup
from coins.models import EducoinWallet  

@csrf_exempt
def api_create_group(request):
    if request.method == "POST":
        data = json.loads(request.body)
        teacher_email = data.get('teacher_email')
        name = data.get('name')
        max_students = data.get('max_students', 30)
        coin_limit = data.get('coin_limit')
        end_date = data.get('end_date')  # formato "YYYY-MM-DD"

        try:
            teacher = User.objects.get(email=teacher_email, role='teacher')
        except User.DoesNotExist:
            return JsonResponse({"success": False, "error": "Docente no encontrado"})

        group = Group.objects.create(
            name=name,
            teacher=teacher,
            max_students=max_students,
            coin_limit=coin_limit,
            start_date=timezone.now().date(),
            end_date=end_date
        )

        return JsonResponse({
            "success": True,
            "message": "Grupo creado con éxito",
            "group_id": group.id,
            "group_name": group.name
        })
    

from django.utils import timezone
from groups.models import Group, StudentGroup
from coins.models import EducoinWallet, EducoinTransaction
from auctions.models import Auction, AuctionBid

# 1. CREAR GRUPO
@csrf_exempt
def api_create_group(request):
    if request.method == "POST":
        data = json.loads(request.body)
        try:
            teacher = User.objects.get(email=data['teacher_email'], role='teacher')
        except User.DoesNotExist:
            return JsonResponse({"success": False, "error": "Docente no encontrado"})
        group = Group.objects.create(
            name=data['name'],
            teacher=teacher,
            max_students=data.get('max_students', 30),
            coin_limit=data['coin_limit'],
            start_date=timezone.now().date(),
            end_date=data['end_date']
        )
        return JsonResponse({"success": True, "group_id": group.id, "name": group.name})


# 2. LISTAR GRUPOS DEL DOCENTE
@csrf_exempt
def api_teacher_groups(request):
    if request.method == "POST":
        data = json.loads(request.body)
        groups = Group.objects.filter(teacher__email=data['teacher_email']).values(
            'id', 'name', 'max_students', 'coin_limit', 'is_closed'
        )
        return JsonResponse({"success": True, "groups": list(groups)})


# 3. ASIGNAR ESTUDIANTE A GRUPO
@csrf_exempt
def api_add_student_to_group(request):
    if request.method == "POST":
        data = json.loads(request.body)
        try:
            group = Group.objects.get(id=data['group_id'], teacher__email=data['teacher_email'])
            student = User.objects.get(email=data['student_email'], role='student')
        except (Group.DoesNotExist, User.DoesNotExist):
            return JsonResponse({"success": False, "error": "Grupo o estudiante no válido"})
        if StudentGroup.objects.filter(student=student, group=group).exists():
            return JsonResponse({"success": False, "error": "Estudiante ya está en el grupo"})
        StudentGroup.objects.create(student=student, group=group)
        EducoinWallet.objects.get_or_create(student=student, group=group, defaults={'balance': 0})
        return JsonResponse({"success": True, "message": "Estudiante agregado y billetera creada"})


# 4. DAR MONEDAS A ESTUDIANTE
@csrf_exempt
def api_award_educoins(request):
    if request.method == "POST":
        data = json.loads(request.body)
        try:
            group = Group.objects.get(id=data['group_id'], teacher__email=data['teacher_email'])
            student = User.objects.get(email=data['student_email'], role='student')
            wallet = EducoinWallet.objects.get(student=student, group=group)
        except (Group.DoesNotExist, User.DoesNotExist, EducoinWallet.DoesNotExist):
            return JsonResponse({"success": False, "error": "Grupo, estudiante o billetera no válidos"})

        amount = data['amount']
        reason = data.get('reason', 'Recompensa docente')
        task_type = data.get('task_type', 'other')

        wallet.balance += amount
        wallet.save()
        EducoinTransaction.objects.create(
            wallet=wallet,
            amount=amount,
            reason=reason,
            task_type=task_type
        )
        return JsonResponse({"success": True, "new_balance": wallet.balance})


# 5. CREAR SUBASTA
@csrf_exempt
def api_create_auction(request):
    if request.method == "POST":
        data = json.loads(request.body)
        try:
            group = Group.objects.get(id=data['group_id'], teacher__email=data['teacher_email'])
        except Group.DoesNotExist:
            return JsonResponse({"success": False, "error": "Grupo no válido"})

        auction = Auction.objects.create(
            group=group,
            title=data['title'],
            description=data['description'],
            reward_type=data.get('reward_type', 'other'),
            min_bid=data.get('min_bid', 1)
        )
        return JsonResponse({"success": True, "auction_id": auction.id})


# 6. CERRAR SUBASTA Y DEFINIR GANADOR
@csrf_exempt
def api_close_auction(request):
    if request.method == "POST":
        data = json.loads(request.body)
        try:
            auction = Auction.objects.get(
                id=data['auction_id'],
                group__teacher__email=data['teacher_email'],
                is_open=True
            )
        except Auction.DoesNotExist:
            return JsonResponse({"success": False, "error": "Subasta no válida o ya cerrada"})

        top_bid = AuctionBid.objects.filter(auction=auction).order_by('-amount').first()
        if top_bid:
            auction.winner = top_bid.student
            auction.winning_bid = top_bid.amount
            auction.is_open = False
            auction.closed_at = timezone.now()
            auction.save()

            # Descontar monedas al ganador
            wallet = EducoinWallet.objects.get(student=top_bid.student, group=auction.group)
            wallet.balance -= top_bid.amount
            wallet.save()
            EducoinTransaction.objects.create(
                wallet=wallet,
                amount=-top_bid.amount,
                reason=f"Ganaste subasta: {auction.title}",
                task_type='auction'
            )
            return JsonResponse({"success": True, "winner": top_bid.student.email, "bid": top_bid.amount})

        return JsonResponse({"success": False, "error": "No hubo ofertas"})
        