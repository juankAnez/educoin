# 🎓 Educoin

<div align="center">

![Educoin Logo](https://img.shields.io/badge/Educoin-Learn%20•%20Earn%20•%20Evolve-orange?style=for-the-badge&logo=bitcoin&logoColor=white)

**Plataforma web de gamificación educativa para instituciones de Colombia**

[![Django](https://img.shields.io/badge/Django-5.2-092E20?style=flat-square&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Características](#-características) •
[Instalación](#-instalación) •
[API](#-api-endpoints) •
[Tecnologías](#-stack-tecnológico)

</div>

---

## 📖 Descripción

**Educoin** es una plataforma innovadora que transforma el aprendizaje en una experiencia gamificada. Los docentes pueden premiar a sus estudiantes con **Educoins** (monedas virtuales) por su desempeño académico, las cuales pueden ser utilizadas en subastas exclusivas para ganar premios reales.

### 🎯 Problema que resuelve

- **Motivación estudiantil:** Aumenta el engagement mediante recompensas tangibles
- **Seguimiento académico:** Sistema integral de calificaciones y actividades
- **Gestión eficiente:** Simplifica la administración de clases y grupos
- **Competencia sana:** Subastas que fomentan el esfuerzo continuo

---

## ✨ Características

### 👨‍🏫 Para Docentes
- ✅ Gestión completa de clases y grupos
- ✅ Creación de actividades con recompensas en Educoins
- ✅ Sistema de calificaciones con conversión automática a monedas
- ✅ Creación y administración de subastas
- ✅ Dashboard con métricas y reportes
- ✅ Notificaciones en tiempo real

### 👨‍🎓 Para Estudiantes
- ✅ Billetera digital de Educoins
- ✅ Seguimiento de actividades y calificaciones
- ✅ Participación en subastas
- ✅ Sistema de pujas competitivas
- ✅ Historial completo de transacciones
- ✅ Notificaciones personalizadas

### 🔐 Seguridad y Autenticación
- ✅ Registro con verificación de email
- ✅ Login con Google OAuth
- ✅ JWT tokens con refresh automático
- ✅ Detección de intentos fallidos de login
- ✅ Restablecimiento seguro de contraseña
- ✅ Notificaciones de seguridad

---

## 🚀 Stack Tecnológico

### Backend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| ![Django](https://img.shields.io/badge/Django-5.2-092E20?style=flat-square&logo=django) | 5.2 | Framework principal |
| ![DRF](https://img.shields.io/badge/DRF-3.14-red?style=flat-square) | 3.14 | API RESTful |
| ![JWT](https://img.shields.io/badge/JWT-Tokens-000000?style=flat-square&logo=json-web-tokens) | - | Autenticación |
| ![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql) | 8.0 | Base de datos |
| ![Allauth](https://img.shields.io/badge/Allauth-OAuth-orange?style=flat-square) | - | Google OAuth |

### Frontend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| ![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react) | 18 | Biblioteca UI |
| ![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite) | 5 | Build tool |
| ![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css) | 3 | Estilos |
| ![React Router](https://img.shields.io/badge/React_Router-6-CA4245?style=flat-square&logo=react-router) | 6 | Navegación |
| ![Axios](https://img.shields.io/badge/Axios-1.6-5A29E4?style=flat-square) | 1.6 | HTTP Client |

### Otras Dependencias
```
django-cors-headers
djangorestframework-simplejwt
python-decouple
Pillow
django-allauth
```

---

## 📦 Instalación

### Prerrequisitos

- Python 3.10+
- Node.js 18+
- MySQL 8.0+
- Git

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/juankAnez/educoin.git
cd educoin
```

### 2️⃣ Configurar Backend

#### Crear entorno virtual
```bash
python -m venv venv

# Windows
.\venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

#### Instalar dependencias
```bash
cd Educoin-Backend
pip install -r requirements.txt
```

#### Configurar archivo `.env`
Crear archivo `.env` en la raíz del backend:

```env
# Django
SECRET_KEY=tu-clave-secreta-aqui-muy-segura
DEBUG=True

# Database
DB_NAME=educoin_db
DB_USER=educoin_user
DB_PASSWORD=tu_password_seguro
DB_HOST=localhost
DB_PORT=3306

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=tu_email@gmail.com
EMAIL_HOST_PASSWORD=tu_app_password
DEFAULT_FROM_EMAIL=noreply@educoin.com

# Google OAuth
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret

# Frontend
FRONTEND_URL=http://localhost:5173
```

#### Crear base de datos
```sql
CREATE DATABASE educoin_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'educoin_user'@'localhost' IDENTIFIED BY 'tu_password_seguro';
GRANT ALL PRIVILEGES ON educoin_db.* TO 'educoin_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Ejecutar migraciones
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Crear superusuario
```bash
python manage.py createsuperuser
```

#### Iniciar servidor backend
```bash
python manage.py runserver 0.0.0.0:8000
```

Backend disponible en: `http://localhost:8000/api/`

---

### 3️⃣ Configurar Frontend

#### Navegar al directorio frontend
```bash
cd ../Educoin-Frontend
```

#### Instalar dependencias
```bash
npm install
```

#### Configurar variables de entorno
Crear archivo `.env` en la raíz del frontend:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=tu-google-client-id
```

#### Iniciar servidor frontend
```bash
npm run dev
```

Frontend disponible en: `http://localhost:5173`

---

## 🔌 API Endpoints

> **Base URL:** `/api/`  
> **Autenticación:** `Authorization: Bearer <token>`

### 🔐 Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/users/register/` | Registro manual | ❌ |
| `POST` | `/users/login/` | Login manual | ❌ |
| `POST` | `/users/google/` | Login con Google | ❌ |
| `GET` | `/users/verify-email/<token>/` | Verificar email | ❌ |
| `POST` | `/users/resend-verification/` | Reenviar verificación | ❌ |
| `POST` | `/users/password-reset/` | Solicitar reset | ❌ |
| `POST` | `/users/password-reset-confirm/<uid>/<token>/` | Confirmar reset | ❌ |

### 👤 Perfil de Usuario

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/users/profile/` | Obtener perfil | ✅ |
| `PATCH` | `/users/profile/update/` | Actualizar perfil | ✅ |
| `PATCH` | `/users/change-password/` | Cambiar contraseña | ✅ |
| `DELETE` | `/users/delete-account/` | Eliminar cuenta | ✅ |

### 👥 Gestión de Usuarios (Admin)

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| `GET` | `/users/list/` | Listar usuarios | Admin |
| `PATCH` | `/users/<id>/update/` | Actualizar usuario | Admin |
| `DELETE` | `/users/<id>/delete/` | Eliminar usuario | Admin |

### 🏫 Clases (Classrooms)

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| `GET` | `/classrooms/` | Listar clases | Todos |
| `POST` | `/classrooms/` | Crear clase | Docente |
| `GET` | `/classrooms/<id>/` | Detalle de clase | Todos |
| `PATCH` | `/classrooms/<id>/` | Actualizar clase | Docente |
| `DELETE` | `/classrooms/<id>/` | Eliminar clase | Docente |
| `GET` | `/classrooms/<id>/students/` | Estudiantes de clase | Docente |

### 👥 Grupos (Groups)

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| `GET` | `/groups/` | Listar grupos | Todos |
| `POST` | `/groups/` | Crear grupo | Docente |
| `GET` | `/groups/<id>/` | Detalle de grupo | Todos |
| `POST` | `/groups/join/` | Unirse con código | Estudiante |
| `POST` | `/groups/<id>/join/` | Unirse por ID | Estudiante |

### 📝 Actividades (Activities)

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| `GET` | `/activities/` | Listar actividades | Todos |
| `POST` | `/activities/` | Crear actividad | Docente |
| `GET` | `/activities/<id>/` | Detalle de actividad | Todos |
| `PATCH` | `/activities/<id>/` | Actualizar actividad | Docente |
| `DELETE` | `/activities/<id>/` | Eliminar actividad | Docente |

### 📤 Entregas (Submissions)

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| `GET` | `/submissions/` | Listar entregas | Todos |
| `POST` | `/submissions/` | Crear entrega | Estudiante |
| `GET` | `/submissions/<id>/` | Detalle de entrega | Todos |
| `PATCH` | `/submissions/<id>/grade/` | Calificar entrega | Docente |

### 📊 Calificaciones (Grades)

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| `GET` | `/grades/` | Listar calificaciones | Todos |
| `GET` | `/grades/mis-notas/` | Mis calificaciones | Estudiante |
| `GET` | `/grades/grupo/<id>/reporte/` | Reporte grupal | Docente |
| `POST` | `/grades/calificar-multiple/` | Calificar múltiples | Docente |

### 💰 Sistema de Monedas (Coins)

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| `GET` | `/coins/wallets/mi-wallet/` | Ver mi billetera | Estudiante |
| `GET` | `/coins/transactions/` | Historial de transacciones | Estudiante |
| `GET` | `/coins/periods/` | Períodos académicos | Todos |
| `POST` | `/coins/wallets/<id>/depositar/` | Depositar Educoins | Docente |

### 🎯 Subastas (Auctions)

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| `GET` | `/auctions/auctions/` | Listar subastas | Todos |
| `POST` | `/auctions/auctions/` | Crear subasta | Docente |
| `GET` | `/auctions/auctions/<id>/` | Detalle de subasta | Todos |
| `POST` | `/auctions/auctions/<id>/close/` | Cerrar subasta | Docente |

### 💸 Pujas (Bids)

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| `GET` | `/auctions/bids/` | Listar pujas | Todos |
| `POST` | `/auctions/bids/` | Crear puja | Estudiante |
| `GET` | `/auctions/bids/<id>/` | Detalle de puja | Todos |
| `GET` | `/auctions/bids/por-subasta/<id>/` | Pujas por subasta | Todos |

### 🔔 Notificaciones

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/notifications/` | Listar notificaciones | ✅ |
| `GET` | `/notifications/no-leidas/` | Notificaciones no leídas | ✅ |
| `POST` | `/notifications/<id>/marcar-leida/` | Marcar como leída | ✅ |
| `POST` | `/notifications/marcar-todas-leidas/` | Marcar todas leídas | ✅ |
| `DELETE` | `/notifications/eliminar-todas/` | Eliminar todas | ✅ |
| `GET` | `/notifications/estadisticas/` | Estadísticas | ✅ |

---

## 🏗️ Arquitectura del Proyecto

### Backend Structure
```
Educoin-Backend/
├── Educoin/                  # Configuración principal
│   ├── settings.py          # Configuración Django
│   ├── urls.py              # URLs principales
│   └── wsgi.py              # WSGI config
├── apps/
│   ├── users/               # Autenticación y usuarios
│   ├── classrooms/          # Gestión de clases
│   ├── groups/              # Grupos de estudiantes
│   ├── activities/          # Actividades académicas
│   ├── grades/              # Sistema de calificaciones
│   ├── coins/               # Sistema de Educoins
│   ├── auctions/            # Sistema de subastas
│   ├── notifications/       # Sistema de notificaciones
│   └── common/              # Modelos y utilidades comunes
├── media/                   # Archivos subidos
├── manage.py
└── requirements.txt
```

### Frontend Structure
```
Educoin-Frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── auth/           # Login, Register
│   │   ├── common/         # Layout, Sidebar, Header
│   │   ├── profile/        # Modales de perfil
│   │   └── notifications/  # Sistema de notificaciones
│   ├── pages/              # Páginas principales
│   │   ├── auth/           # Autenticación
│   │   ├── dashboard/      # Dashboard
│   │   ├── classrooms/     # Clases
│   │   ├── groups/         # Grupos
│   │   ├── activities/     # Actividades
│   │   ├── auctions/       # Subastas
│   │   ├── wallet/         # Billetera
│   │   └── profile/        # Perfil
│   ├── context/            # Context API (Auth, etc)
│   ├── hooks/              # Custom hooks
│   ├── services/           # API services
│   ├── utils/              # Utilidades
│   ├── App.jsx             # Componente principal
│   └── main.jsx            # Entry point
├── public/
├── package.json
└── vite.config.js
```

---

## 👥 Roles del Sistema

### 🔴 Administrador
- Acceso completo al sistema
- Gestión de todos los usuarios
- Panel de administración Django
- Configuración global

### 🟡 Docente
- Crear y gestionar clases
- Crear grupos de estudiantes
- Diseñar actividades con recompensas
- Calificar entregas
- Crear y gestionar subastas
- Depositar Educoins
- Ver reportes y estadísticas

### 🟢 Estudiante
- Unirse a grupos
- Visualizar y completar actividades
- Ver calificaciones y Educoins ganados
- Gestionar billetera digital
- Participar en subastas
- Realizar pujas
- Recibir notificaciones

---

## 🧪 Pruebas

### Usando Thunder Client / Postman

1. **Registrarse**
```json
POST /api/users/register/
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "password_confirm": "password123",
  "role": "estudiante"
}
```

2. **Login**
```json
POST /api/users/login/
{
  "email": "juan@example.com",
  "password": "password123"
}
```

3. **Usar el token**
```
Headers:
Authorization: Bearer <tu_access_token>
```

### Ejecutar tests automatizados
```bash
# Backend
cd Educoin-Backend
python manage.py test

# Frontend
cd Educoin-Frontend
npm run test
```

---

## 📱 Capturas de Pantalla

> 🚧 En desarrollo - Próximamente

---

## 🗺️ Roadmap

### ✅ Fase 1 - Completada
- [x] Sistema de autenticación
- [x] Gestión de clases y grupos
- [x] Sistema de actividades y entregas
- [x] Sistema de calificaciones
- [x] Sistema de Educoins
- [x] Sistema de subastas
- [x] Sistema de notificaciones

### 🚧 Fase 2 - En Desarrollo
- [ ] Verificación de email
- [ ] Notificaciones por email
- [ ] Dashboard mejorado con gráficos
- [ ] Sistema de logros y badges
- [ ] Ranking de estudiantes

### 📋 Fase 3 - Planificada
- [ ] App móvil (React Native)
- [ ] Chat en tiempo real (WebSockets)
- [ ] Integración con plataformas LMS
- [ ] Exportación de reportes (PDF/Excel)
- [ ] Sistema de referidos

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/juankAnez">
        <img src="https://github.com/juankAnez.png" width="100px;" alt="Juan Añez"/>
        <br />
        <sub><b>Juan Añez</b></sub>
      </a>
      <br />
      <sub>Backend Developer</sub>
    </td>
    <td align="center">
      <a href="https://github.com/ivnmtz09">
        <img src="https://github.com/ivnmtz09.png" width="100px;" alt="Ivan Martinez"/>
        <br />
        <sub><b>Ivan Martinez</b></sub>
      </a>
      <br />
      <sub>Full Stack Developer</sub>
    </td>
  </tr>
</table>

---

## 📞 Contacto

**Educoin Team**
- Emails: [Juan Añez](https://mail.google.com/mail/u/0/?fs=1&to=janiez@uniguajira.edu.co&tf=cm)
- GitHub: [@juankAnez](https://github.com/juankAnez)
- Emails: [Ivan Martinez](https://mail.google.com/mail/u/2/?fs=1&to=ijesusmartinez@uniguajira.edu.co&tf=cm)
- GitHub: [@ivnmtz09](https://github.com/ivnmtz09)

---

## 🙏 Agradecimientos

- A todas las instituciones educativas que confían en Educoin
- A la comunidad de Django y React
- A nuestros beta testers

---

<div align="center">

**[⬆ Volver arriba](#-educoin)**

Hecho con ❤️ en Colombia 🇨🇴

[![Stars](https://img.shields.io/github/stars/juankAnez/educoin?style=social)](https://github.com/juankAnez/educoin)
[![Forks](https://img.shields.io/github/forks/juankAnez/educoin?style=social)](https://github.com/juankAnez/educoin)

</div>