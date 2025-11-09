# Educoin

Plataforma web de gamificación educativa para instituciones de Colombia.
Permite a docentes premiar a estudiantes con monedas virtuales (Educoins) por su desempeño académico, que luego pueden usar en subastas de premios.

## Tecnologías

### Backend
- Django
- Django REST Framework  
- JWT
- MySQL
- (Allauth próximamente)

### Frontend
- React
- Vite
- Tailwind CSS

### Otros
- django-cors-headers
- drf-yasg
- axios
- (más dependencias serán documentadas)

## Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/juankAnez/educoin.git
cd educoin
```

### 2. Crear y activar entorno virtual
```bash
python -m venv venv

# Windows:
.\venv\Scripts\activate

# Linux/Mac:
source venv/bin/activate
```

### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 4. Configurar archivo .env
```env
SECRET_KEY=...
DEBUG=True
DB_NAME=educoin_db
DB_USER=educoin_user
DB_PASSWORD=...
DB_HOST=localhost
DB_PORT=3306
```

### 5. Crear base de datos MySQL
```sql
CREATE DATABASE educoin_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'educoin_user'@'localhost' IDENTIFIED BY 'tu_password';
GRANT ALL PRIVILEGES ON educoin_db.* TO 'educoin_user'@'localhost';
FLUSH PRIVILEGES;
```

### 6. Realizar migraciones
```bash
python manage.py makemigrations
python manage.py migrate
```

### 7. Crear superusuario
```bash
python manage.py createsuperuser
```

### 8. Iniciar servidor
```bash
python manage.py runserver 0.0.0.0:8000
```

La API estará disponible en `http://localhost:8000/api/`

## API Endpoints

> Todos los endpoints están bajo el prefijo `/api/`

### Users (Autenticación y Perfiles)
- `POST /users/register/` - Registro de usuario
- `POST /users/login/` - Login manual
- `POST /users/google/` - Login con Google
- `GET /users/profile/` - Obtener perfil
- `PATCH /users/profile/update/` - Actualizar perfil
- `PATCH /users/change-password/` - Cambiar contraseña
- `POST /users/password-reset/` - Resetear contraseña
- `POST /users/password-reset-confirm/<uidb64>/<token>/` - Confirmar reset

### Users (Admin)
- `GET /users/list/` - Listar usuarios
- `PATCH /users/<user_id>/update/` - Actualizar usuario
- `DELETE /users/<user_id>/delete/` - Eliminar usuario

### Classrooms
- `GET, POST /classrooms/` - Listar/Crear clases
- `GET, PATCH, DELETE /classrooms/<id>/` - Gestionar clase
- `GET /classrooms/<id>/students/` - Ver estudiantes

### Groups
- `GET, POST /groups/` - Listar/Crear grupos
- `GET, PATCH, DELETE /groups/<id>/` - Gestionar grupo
- `POST /groups/join/` - Unirse por código
- `POST /groups/<id>/join/` - Unirse por ID

### Activities
- `GET, POST /activities/` - Listar/Crear actividades
- `GET, PATCH, DELETE /activities/<id>/` - Gestionar actividad

### Submissions
- `GET, POST /submissions/` - Listar/Crear entregas
- `GET /submissions/<id>/` - Ver entrega
- `PATCH /submissions/<id>/grade/` - Calificar

### Grades
- `GET /grades/` - Listar calificaciones
- `GET /grades/mis-notas/` - Ver notas propias
- `GET /grades/grupo/<group_id>/reporte/` - Reporte grupal
- `POST /grades/calificar-multiple/` - Calificación múltiple

### Coins
- `GET /coins/periods/` - Listar períodos
- `GET /coins/wallets/mi-wallet/` - Ver billetera
- `POST /coins/wallets/<wallet_id>/depositar/` - Depositar
- `GET /coins/transactions/` - Ver transacciones

### Auctions
- `GET, POST /auctions/` - Listar/Crear subastas
- `GET /auctions/<id>/` - Ver subasta
- `POST /auctions/<id>/close/` - Cerrar subasta

### Bids
- `GET, POST /bids/` - Listar/Crear pujas
- `GET /bids/<id>/` - Ver puja

### Notifications
- `GET /notifications/` - Listar notificaciones
- `GET /notifications/no-leidas/` - Ver no leídas
- `POST /notifications/<id>/marcar-leida/` - Marcar leída
- `POST /notifications/marcar-todas-leidas/` - Marcar todas
- `DELETE /notifications/eliminar-todas/` - Eliminar todas

## Apps Principales
- `users`: Usuarios y autenticación
- `classrooms`: Gestión de clases
- `groups`: Grupos y membresías
- `activities`: Actividades y entregas
- `coins`: Sistema de Educoins
- `grades`: Sistema de calificaciones
- `auctions`: Sistema de subastas
- `notifications`: Sistema de notificaciones

## Roles
- **Administrador**: Gestión global
- **Docente**: Gestión académica
- **Estudiante**: Participación

## Pruebas
Use Thunder Client, Postman u otro cliente HTTP.
Header requerido: `Authorization: Bearer <token>`

## Notas
- Frontend en `./Educoin-Frontend`
- Documentación API: drf-yasg/drf-spectacular

## Autores
Equipo Educoin:
- Juan Añez
- Ivan Martinez
