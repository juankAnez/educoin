# Educoin

Plataforma web de gamificación educativa para instituciones de Colombia.  
Permite a docentes premiar a estudiantes con monedas virtuales (Educoins) por su desempeño académico, que luego pueden usar en subastas de premios.

## Tecnologías

- **Backend:** Django, Django REST Framework, JWT, MySQL, (Allauth proximamente)
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
   python manage.py runserver
   ```

## Endpoints principales

- **Autenticación y registro:**  
  - `/api/users/register/`  
  - `/api/users/login/`  
  - `/api/users/profile/`

- **Login Allauth:**
  - `/accounts/login/`
  - `/accounts/logout/`
  - `/accounts/google/login/`

- **CRUD de entidades principales (requiere JWT):**
  - `/api/classrooms/`
  - `/api/groups/`
  - `/api/activities/`

## Apps principales

- **users:** Usuarios, roles, autenticación.
- **classrooms** Clases asignadas a usuarios con rol de docente.
- **groups:** Grupos de las clases asignadas a docentes y relación con estudiante.
- **coins:** Billeteras y transacciones de Educoins.
- **auctions:** Subastas y pujas de estudiantes.
- **...** más adelante, faltan pruebas.

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
