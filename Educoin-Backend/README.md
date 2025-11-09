# Educoin

Plataforma web de gamificación educativa para instituciones de Colombia.  
Permite a docentes premiar a estudiantes con monedas virtuales (Educoins) por su desempeño académico, que luego pueden usar en subastas de premios.

## Tecnologías

- **Backend:** Django, Django REST Framework, JWT, MySQL, (Allauth próximamente)
- **Frontend:** React, Vite, Tailwind CSS
- **Otros:** django-cors-headers, drf-yasg, axios, (más adelante se documentará más)

## Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/juankAnez/educoin.git
   cd educoin
   ```

2. **Crea y activa un entorno virtual**
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Linux/Mac:
   source venv/bin/activate
   ```

3. **Instala las dependencias**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configura el archivo `.env`**
   Copia el ejemplo y ajusta tus credenciales:
   ```
   SECRET_KEY=...
   DEBUG=True
   DB_NAME=educoin_db
   DB_USER=educoin_user
   DB_PASSWORD=...
   DB_HOST=localhost
   DB_PORT=3306
   ```

5. **Crea la base de datos MySQL**
   ```sql
   CREATE DATABASE educoin_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'educoin_user'@'localhost' IDENTIFIED BY 'tu_password';
   GRANT ALL PRIVILEGES ON educoin_db.* TO 'educoin_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

6. **Realiza las migraciones**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Crea un superusuario**
   ```bash
   python manage.py createsuperuser
   ```

8. **Inicia el servidor**
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

## Endpoints principales

- **Autenticación y registro:**  
  - `/api/users/register/`  
  - `/api/users/login/`  
  - `/api/users/profile/`
  - `/api/users/profile/update/`  
  - `/api/users/password-reset/` 

- **Login Allauth:**
  - `/accounts/login/`
  - `/accounts/logout/`
  - `/accounts/google/login/`

- **CRUD de entidades principales (requiere JWT):**
  - `/api/classrooms/`
  - `/api/groups/`
  - `/api/groups/join/`  
  - `/api/activities/`
  - `/api/submissions/`
  - `/api/submissions/<id>/grade/`
  - `/api/coins/wallets/`
  - `/api/coins/transactions/`
  - `/api/grades/`
  - `/api/auctions/`

## Apps principales

- **users:** Usuarios, roles, autenticación.
- **classrooms:** Clases asignadas a usuarios con rol de docente.
- **groups:** Grupos de las clases asignadas a docentes y relación con estudiante.
- **activities:** Actividades, envíos (submissions) y calificaciones.
- **coins:** Billeteras y transacciones de Educoins.
- **grades:** Registro oficial de calificaciones.
- **auctions:** Subastas y pujas de estudiantes.

## Roles

- **Administrador:** Gestión global de la plataforma.
- **Docente:** Crea clases, actividades, subastas y asigna Educoins.
- **Estudiante:** Participa en clases, actividades y subastas.

## Pruebas

Puedes usar Thunder Client, Postman o cualquier cliente HTTP para probar los endpoints.  
Recuerda enviar el token JWT en el header `Authorization: Bearer <token>` para endpoints protegidos.

## Notas

- El frontend (React + Vite + Tailwind) se desarrolla en el mismo repositorio en la ruta *./Educoin-Frontend* .
- Para documentación automática de la API, puedes instalar y configurar `drf-yasg` o `drf-spectacular`.

---

**Autores:** Equipo Educoin (Juan Añez e Ivan Martinez)
