# Matcha - App de Citas Online

English: see `README.en.md`

Matcha es una aplicación web de citas moderna construida con **SvelteKit**, que permite a los usuarios encontrar conexiones románticas basándose en ubicación geográfica, intereses comunes y preferencias personales.

## 🛠️ Stack Tecnológico

### Frontend

- **SvelteKit 2.x** - Framework web moderno y reactivo
- **Svelte 5.x** - Componentes con sistema de reactividad mejorado
- **TailwindCSS 4.x** - Framework CSS utilitario
- **DaisyUI 5.x** - Componentes UI pre-construidos para Tailwind
- **TypeScript** - Tipado estático para JavaScript

### Backend

- **SvelteKit Server** - API full-stack con server-side rendering
- **PostgreSQL** - Base de datos relacional
- **Node.js** con runtime de Bun

### Servicios Externos

- **AWS S3** - Almacenamiento de imágenes de perfil
- **Mailjet** - Servicio de emails transaccionales
- **Geolocation APIs** - Para ubicación geográfica automática y manual

### Autenticación y Seguridad

- **Argon2** - Hash de contraseñas
- **Oslo** - Utilidades criptográficas
- **Sistema de sesiones** basado en tokens

## 🚀 Características Principales

### 1. Sistema de Autenticación

- **Registro completo** con email, username, nombre, apellido y contraseña
- **Verificación por email** con enlaces únicos
- **Login seguro** con hash de contraseñas Argon2
- **Recuperación de contraseña** vía email
- **Logout** con un clic desde cualquier página
- **Gestión de sesiones** con tokens seguros

### 2. Perfil de Usuario Completo

- **Información personal**: género, orientación sexual, biografía
- **Sistema de tags/intereses** con más de 15 categorías predefinidas
- **Galería de fotos**: hasta 5 imágenes (JPG, PNG, GIF)
- **Ubicación geográfica**: automática por IP o manual
- **Edición completa** de todos los datos del perfil
- **Configuración de privacidad** y preferencias

### 3. Sistema de Descubrimiento Inteligente

- **Algoritmo de matching** basado en:
  - Proximidad geográfica
  - Intereses comunes (tags)
  - Rating de popularidad ("fame rating")
  - Orientación sexual compatible
- **Ordenamiento** por edad, distancia, rating y compatibilidad
- **Filtros avanzados** por múltiples criterios
- **Sugerencias personalizadas** según el perfil del usuario

### 4. Búsqueda Avanzada

- **Filtros por edad**: rango personalizable
- **Filtros por distancia**: radio configurable
- **Filtros por rating**: popularidad mínima/máxima
- **Filtros por tags**: selección múltiple de intereses
- **Resultados ordenables** y filtrados dinámicamente

### 5. Interacciones Sociales

- **Sistema de "likes"**: dar y quitar likes
- **Matching**: cuando dos usuarios se gustan mutuamente
- **Bloqueo de usuarios**: prevenir interacciones no deseadas
- **Reporte de perfiles**: moderación de contenido falso
- **Historial de visitas**: seguimiento de quién vio tu perfil

### 6. Chat en Tiempo Real

- **Mensajería instantánea** entre usuarios matched
- **Server-Sent Events (SSE)** para notificaciones en tiempo real
- **Interfaz de chat moderna** con historial de mensajes
- **Indicadores de estado**: online/offline y última conexión

### 7. Sistema de Notificaciones

Notificaciones en tiempo real para:

- ❤️ **Likes recibidos**
- 👀 **Visitas al perfil**
- 💘 **Nuevos matches**
- 💔 **Unlikes**
- 💬 **Mensajes de chat**

### 8. Configuración y Privacidad

- **Configuración de cuenta**: cambio de datos personales
- **Gestión de contraseña**: cambio seguro con verificación
- **Configuración de ubicación**: automática o manual
- **Gestión de fotos**: subida, edición y eliminación
- **Lista de usuarios bloqueados**
- **Eliminación de cuenta**

## 🗂️ Estructura del Proyecto

```
src/
├── app.html                 # Template HTML principal
├── app.css                  # Estilos globales
├── hooks.server.ts          # Hooks del servidor SvelteKit
├── lib/
│   ├── components/          # Componentes reutilizables
│   │   ├── chat/           # Componentes del chat
│   │   └── common/         # Componentes comunes (UI)
│   ├── helpers/            # Funciones utilitarias
│   │   ├── validators.ts   # Validadores de formularios
│   │   ├── user.ts        # Utilidades de usuario
│   │   └── enum.ts        # Enums y constantes
│   ├── server/            # Lógica del servidor
│   │   ├── auth.ts        # Sistema de autenticación
│   │   ├── users.ts       # Gestión de usuarios
│   │   ├── utils.ts       # Utilidades del servidor
│   │   └── db/            # Configuración de base de datos
│   ├── stores/            # Stores de Svelte
│   └── mail/              # Sistema de emails
├── params/                # Parámetros de rutas personalizados
├── routes/                # Rutas de la aplicación
│   ├── auth/             # Autenticación (login, registro)
│   ├── api/              # Endpoints API
│   ├── chat/             # Sistema de mensajería
│   ├── discover/         # Página de descubrimiento
│   ├── search/           # Búsqueda avanzada
│   ├── settings/         # Configuración de cuenta
│   ├── users/[user]/     # Perfiles de usuario
│   └── notifications/    # Centro de notificaciones
└── static/               # Archivos estáticos
    ├── assets/           # Imágenes y iconos
    └── icons/            # Iconografía de la app
```

## 🖼️ Images / Imágenes

Este proyecto incluye una carpeta `images/` para almacenar fotos y recursos visuales. Añadiré imágenes pronto. Si quieres añadir imágenes ahora, colócalas en la carpeta `images/` en la raíz del repositorio y referencia su ruta desde la carpeta `static/assets/` o desde `src` según necesites.

- Ubicación de la carpeta: `images/` (raíz del proyecto)
- Formatos recomendados: JPG, PNG, GIF
- Notas: las imágenes de perfil se gestionan desde AWS S3 en la configuración de producción; en desarrollo puedes usar la carpeta `images/` localmente.


## 🗃️ API Endpoints

### Autenticación

- `POST /auth/login` - Inicio de sesión
- `POST /auth/register` - Registro de usuario
- `GET /auth/register/[token]` - Verificación de email
- `POST /auth/login/forgotpassword` - Recuperación de contraseña

### Usuarios

- `GET /users/[username]` - Ver perfil de usuario
- `POST /api/visit` - Registrar visita a perfil
- `POST /api/like-user` - Dar/quitar like
- `POST /api/block-user` - Bloquear/desbloquear usuario
- `POST /api/report-user` - Reportar usuario

### Descubrimiento

- `POST /api/get-users-by-distance` - Usuarios por proximidad
- `POST /api/get-users-by-age` - Usuarios por edad
- `POST /api/get-users-by-rating` - Usuarios por rating
- `POST /api/user-research` - Búsqueda avanzada

### Geolocalización

- `GET /api/ip-location` - Ubicación por IP
- `POST /api/location-update` - Actualizar ubicación
- `GET /api/manual-location` - Búsqueda de ubicaciones
- `POST /api/reverse-geocode` - Geocodificación inversa

### Chat y Notificaciones

- `GET /api/messages` - Obtener mensajes de chat
- `POST /chat` - Enviar mensaje
- `POST /api/match` - Verificar match
- `GET /api/notifications/stream` - Stream de notificaciones SSE
- `POST /api/notifications/set-read` - Marcar notificaciones como leídas

### Utilidades

- `GET /api/get-tags` - Obtener tags disponibles
- `GET /api/get-blocked-users` - Lista de usuarios bloqueados
- `GET /api/check-like` - Verificar si usuario está likeado
- `GET /api/check-block` - Verificar si usuario está bloqueado

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Bun** (recomendado) o Node.js 18+
- **PostgreSQL** 13+
- Cuentas en servicios externos (AWS S3, Mailjet, APIs de geolocalización)

### Variables de Entorno

```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/matcha
AWS_ACCESS_KEY_ID=tu_aws_access_key
AWS_SECRET_ACCESS_KEY=tu_aws_secret_key
AWS_REGION=tu_region
AWS_BUCKET_NAME=tu_bucket
MAILJET_API_KEY=tu_mailjet_api_key
MAILJET_SECRET_KEY=tu_mailjet_secret
IPGEOLOCATION_API_KEY=tu_ipgeolocation_key
GEOAPIFY_API_KEY=tu_geoapify_key
```

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/PILTRAFILLA317/42-matcha.git
cd 42-matcha

# Instalar dependencias
bun install

# Configurar base de datos
# (Ejecutar scripts de migración según tu setup de PostgreSQL)

# Modo desarrollo
bun run dev

# Construcción para producción
bun run build

# Vista previa de producción
bun run preview
```

## 🧩 Funcionalidades Técnicas Destacadas

### Sistema de Reactividad Avanzado

- **Svelte 5 Runes**: sistema de reactividad mejorado con `$state`, `$derived`, `$effect`
- **Stores reactivos**: gestión de estado global con notificaciones en tiempo real
- **SSE (Server-Sent Events)**: actualizaciones push sin polling

### Arquitectura de Componentes

- **Componentes modulares**: reutilización y mantenibilidad
- **Props tipadas**: seguridad de tipos con TypeScript
- **Composición avanzada**: componentes especializados para chat, búsqueda, etc.

### Optimización de Performance

- **Lazy loading**: carga diferida de imágenes y componentes
- **Paginación inteligente**: para listas grandes de usuarios/notificaciones
- **Caché de geolocalización**: optimización de consultas de ubicación
- **Debouncing**: en búsquedas y actualizaciones en tiempo real

### Seguridad

- **Validación dual**: cliente y servidor
- **Sanitización de inputs**: prevención de XSS e inyecciones
- **Rate limiting**: protección contra spam y abuse
- **Gestión segura de sesiones**: tokens con expiración

## 👥 Experiencia de Usuario

### Diseño Responsive

- **Mobile-first**: optimizado para dispositivos móviles
- **Design system consistente**: con DaisyUI y TailwindCSS
- **Accesibilidad**: navegación por teclado y lectores de pantalla

### Flujo de Usuario Intuitivo

1. **Onboarding**: registro → verificación → completar perfil
2. **Descubrimiento**: sugerencias → filtros → matches
3. **Interacción**: likes → matches → chat
4. **Gestión**: configuración → privacidad → notificaciones

### Feedback Visual

- **Animaciones sutiles**: transiciones suaves con Svelte
- **Estados de carga**: indicadores de progreso
- **Notificaciones toast**: feedback inmediato de acciones
- **Modales informativos**: confirmaciones y alertas

## 🔄 Estado del Proyecto

**Estado**: ✅ **Funcional y completo**

### Funcionalidades Implementadas

- ✅ Sistema completo de autenticación
- ✅ Perfiles de usuario con fotos
- ✅ Algoritmo de matching inteligente
- ✅ Búsqueda avanzada con filtros
- ✅ Chat en tiempo real
- ✅ Notificaciones push con SSE
- ✅ Geolocalización automática y manual
- ✅ Sistema de likes/matches/bloqueos
- ✅ Panel de configuración completo
- ✅ Diseño responsive y accesible

---

**Desarrollado para el proyecto 42 School - Un ejemplo completo de aplicación web moderna con SvelteKit** 💖
