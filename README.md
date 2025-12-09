# 🎨 Frontend - LoL Match

Aplicación web desarrollada con React y Vite que proporciona la interfaz de usuario para la plataforma **LoL Match**, una aplicación web fullstack desarrollada como proyecto TFM que permite a los jugadores de League of Legends gestionar sus perfiles, formar equipos (squads), buscar partidas y conectarse con la comunidad.

Incluye autenticación, gestión de perfiles, chat en tiempo real, sistema de squads y visualización de estadísticas de League of Legends.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Rutas](#-rutas)
- [Componentes Principales](#-componentes-principales)
- [Contextos](#-contextos)
- [Servicios](#-servicios)
- [Scripts](#-scripts)
- [Documentación](#-documentación)

## ✨ Características

- **Interfaz Moderna**: Diseño responsive con Tailwind CSS y componentes de Radix UI
- **Autenticación Completa**: Login, registro, recuperación de contraseña y verificación de cuenta
- **Gestión de Perfiles**: Visualización y edición de perfiles de usuario y de League of Legends
- **Chat en Tiempo Real**: Mensajería instantánea mediante WebSockets
- **Sistema de Squads**: Creación, gestión y visualización de equipos
- **Estadísticas de LOL**: Visualización de partidas, rankings y estadísticas de Riot Games
- **Sistema de Matches**: Búsqueda y conexión con otros jugadores
- **Notificaciones**: Sistema de notificaciones en tiempo real
- **Tema Oscuro/Claro**: Soporte para cambio de tema
- **Validación de Formularios**: React Hook Form con validación Zod

## 🛠 Tecnologías

### Core

- **React 19** - Biblioteca de UI
- **Vite 7** - Build tool y dev server
- **React Router DOM 7** - Enrutamiento

### Estilos

- **Tailwind CSS 4** - Framework de utilidades CSS
- **Radix UI** - Componentes accesibles y sin estilos
- **Framer Motion** - Animaciones
- **Lucide React** - Iconos
- **next-themes** - Gestión de temas

### Formularios y Validación

- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas
- **@hookform/resolvers** - Integración Zod + React Hook Form

### Comunicación

- **Axios** - Cliente HTTP
- **Socket.io Client** - WebSockets para tiempo real

### Utilidades

- **dayjs** - Manejo de fechas
- **js-cookie** - Gestión de cookies
- **sonner** - Sistema de toasts/notificaciones
- **react-responsive** - Detección de dispositivos

## 📁 Estructura del Proyecto

```
TFM-rojo-frontend/
├── public/                    # Archivos estáticos
│   ├── images/               # Imágenes y avatares
│   └── logo.webp             # Logo de la aplicación
│
├── src/
│   ├── components/           # Componentes reutilizables
│   │   ├── ui/               # Componentes base (Radix UI)
│   │   ├── PrivateRoute.jsx  # Protección de rutas
│   │   ├── AppSidebar.jsx    # Barra lateral de navegación
│   │   └── ...
│   │
│   ├── context/              # Context API
│   │   ├── AuthContext.jsx   # Estado de autenticación
│   │   ├── SocketContext.jsx # Conexión WebSocket
│   │   ├── ChatContext.jsx   # Estado del chat
│   │   └── NotificationContext.jsx # Notificaciones
│   │
│   ├── hooks/                # Custom hooks
│   │   ├── useSessionCheck.js # Verificación de sesión
│   │   ├── useLogoutWithModal.js
│   │   └── use-mobile.ts     # Detección móvil
│   │
│   ├── layouts/              # Layouts de página
│   │   ├── AppLayout.jsx     # Layout principal (con sidebar)
│   │   └── AuthLayout.jsx    # Layout de autenticación
│   │
│   ├── pages/                # Páginas/vistas
│   │   ├── Login.jsx         # Página de login
│   │   ├── Signup.jsx        # Página de registro
│   │   ├── Statistics.jsx    # Estadísticas globales
│   │   ├── Squads.jsx        # Lista de squads
│   │   ├── Matches.jsx       # Sistema de matches
│   │   ├── Community.jsx     # Comunidad
│   │   ├── MyProfile.jsx     # Perfil del usuario
│   │   └── ...
│   │
│   ├── routes/               # Configuración de rutas
│   │   └── mainRoutes.jsx    # Definición de todas las rutas
│   │
│   ├── services/             # Servicios API
│   │   ├── apiService.js     # Cliente HTTP base
│   │   ├── authService.js    # Servicios de autenticación
│   │   ├── chatService.js    # Servicios de chat
│   │   └── riotService.js    # Servicios de Riot API
│   │
│   ├── constants/            # Constantes
│   │   ├── navigation.js     # Configuración de navegación
│   │   ├── filters.js        # Filtros y opciones
│   │   └── images.js         # URLs de imágenes
│   │
│   ├── utils/                # Utilidades
│   │   └── ...
│   │
│   ├── schemas/              # Esquemas de validación
│   │   └── userSchemas.js    # Validación de usuarios
│   │
│   ├── test/                 # Configuración de tests
│   │   └── setup.js          # Setup global de Vitest
│   │
│   ├── App.jsx               # Componente raíz
│   ├── main.jsx              # Punto de entrada
│   └── index.css             # Estilos globales
│
├── vite.config.js            # Configuración de Vite
├── vitest.config.js          # Configuración de Vitest
├── cypress.config.js         # Configuración de Cypress
├── tailwind.config.js        # Configuración de Tailwind
├── tsconfig.json             # Configuración TypeScript (proyecto compuesto)
├── tsconfig.app.json         # Configuración TypeScript para la app
├── tsconfig.node.json        # Configuración TypeScript para Node.js
└── package.json              # Dependencias
```

## ⚙️ Instalación

### Prerrequisitos

- Node.js v18 o superior
- npm o yarn
- Backend corriendo (ver [Backend README](../TFM-rojo-backend/README.md))

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/FSD0625ESP/TFM-rojo-frontend.git
cd TFM-rojo-frontend
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:5000/api
```

Para desarrollo en red local:

```env
VITE_API_URL=http://192.168.1.X:5000/api
```

4. **Iniciar el servidor de desarrollo**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🔧 Configuración

### Variables de Entorno

| Variable       | Descripción                | Ejemplo                     |
| -------------- | -------------------------- | --------------------------- |
| `VITE_API_URL` | URL base de la API backend | `http://localhost:5000/api` |

### Vite

El proyecto usa Vite como build tool. Configuración en `vite.config.js`:

- Plugin React SWC para compilación rápida
- Soporte para alias de rutas (`@/` apunta a `./src`)
- Optimización de dependencias (dayjs y plugins)
- Overlay de errores desactivado (`server.hmr.overlay: false`) para que no bloquee las capturas de Cypress
- Soporte para módulos CommonJS y ES modules mixtos

### Tailwind CSS

Configuración en `tailwind.config.js`:

- Tema personalizado
- Colores de la marca
- Breakpoints responsive
- Plugins adicionales

### TypeScript

Aunque el proyecto usa principalmente JavaScript, incluye configuración TypeScript para algunos archivos (hooks, utils). Configuración en `tsconfig.json`:

- **tsconfig.json**: Proyecto compuesto que referencia otros archivos de configuración
- **tsconfig.app.json**: Configuración para la aplicación React
- **tsconfig.node.json**: Configuración para archivos de Node.js (vite.config.js, cypress.config.js, vitest.config.js)
  - Soporte para archivos JavaScript (`allowJs: true`)
  - Tipos de Node.js incluidos (`types: ["node"]`)
  - Sin emisión de archivos (`noEmit: true`)
  - Omite verificación de tipos en librerías (`skipLibCheck: true`)

## 🗺 Rutas

### Rutas Públicas

| Ruta               | Componente       | Descripción                |
| ------------------ | ---------------- | -------------------------- |
| `/login`           | `Login`          | Página de inicio de sesión |
| `/signup`          | `Signup`         | Página de registro         |
| `/forgot-password` | `ForgotPassword` | Recuperación de contraseña |
| `/reset-password`  | `ResetPassword`  | Restablecer contraseña     |
| `/verify-account`  | `VerifyAccount`  | Verificación de cuenta     |
| `/delete-account`  | `DeleteAccount`  | Eliminación de cuenta      |

### Rutas Protegidas - Start

| Ruta                | Componente   | Descripción                     |
| ------------------- | ------------ | ------------------------------- |
| `/start/statistics` | `Statistics` | Estadísticas globales (pública) |
| `/start/squads`     | `Squads`     | Lista de squads                 |
| `/start/matches`    | `Matches`    | Sistema de matches              |
| `/start/community`  | `Community`  | Comunidad de jugadores          |

### Rutas Protegidas - Profile

| Ruta                   | Componente   | Descripción             |
| ---------------------- | ------------ | ----------------------- |
| `/profile/my-profile`  | `MyProfile`  | Perfil del usuario      |
| `/profile/my-squad`    | `MySquad`    | Squad del usuario       |
| `/profile/my-stats`    | `MyStats`    | Estadísticas personales |
| `/profile/my-settings` | `MySettings` | Configuración de cuenta |

### Protección de Rutas

Las rutas protegidas usan el componente `PrivateRoute` que:

- Verifica la autenticación del usuario
- Redirige a `/login` si no está autenticado
- Muestra el contenido si está autenticado

## 🧩 Componentes Principales

### Layouts

#### AppLayout

Layout principal de la aplicación con:

- Sidebar de navegación
- Header con información del usuario
- Área de contenido principal
- Sistema de notificaciones

#### AuthLayout

Layout para páginas de autenticación:

- Diseño centrado
- Sin sidebar
- Formularios de autenticación

### Componentes UI

Componentes base construidos con Radix UI:

- **Button** - Botones con variantes
- **Input** - Campos de texto
- **Dialog** - Modales
- **Dropdown Menu** - Menús desplegables
- **Avatar** - Avatares de usuario
- **Tabs** - Pestañas
- **Select** - Selectores
- **Switch** - Interruptores
- **Progress** - Barras de progreso
- **Tooltip** - Tooltips informativos

### Componentes de Negocio

- **PrivateRoute** - Protección de rutas
- **AppSidebar** - Navegación lateral
- **SectionNav** - Navegación por secciones
- **UserCard** - Tarjeta de usuario
- **SquadCard** - Tarjeta de squad
- **MatchCard** - Tarjeta de match
- **ChatRoom** - Componente de chat
- **StatisticsCard** - Tarjeta de estadísticas

## 🔄 Contextos

### AuthContext

Gestiona el estado de autenticación:

```javascript
const { user, isAuthenticated, loading, login, logout } = useAuth();
```

**Funcionalidades:**

- Verificación automática de sesión al cargar
- Login y logout
- Actualización de datos de usuario
- Gestión de cookies

### SocketContext

Maneja la conexión WebSocket:

```javascript
const { socket, isConnected } = useSocket();
```

**Funcionalidades:**

- Conexión automática al autenticarse
- Desconexión al cerrar sesión
- Reconexión automática
- Eventos de conexión/desconexión

### ChatContext

Gestiona el estado del chat:

```javascript
const { rooms, activeRoom, messages, sendMessage, joinRoom } = useChat();
```

**Funcionalidades:**

- Gestión de salas de chat
- Mensajes en tiempo real
- Conversaciones privadas
- Notificaciones de mensajes

### NotificationContext

Maneja las notificaciones:

```javascript
const { notifications, addNotification, markAsRead } = useNotifications();
```

**Funcionalidades:**

- Notificaciones en tiempo real
- Notificaciones de squad
- Notificaciones de matches
- Sistema de lectura/no leído

## 🔌 Servicios

### apiService

Servicio base para peticiones HTTP:

```javascript
import { makeRequest } from "@/services/apiService";

// GET request
const data = await makeRequest("/users");

// POST request
const result = await makeRequest("/users", "POST", { name: "John" });
```

**Características:**

- Normalización de URLs
- Manejo automático de errores
- Soporte para cookies (credentials: 'include')
- Parsing de errores de validación

### authService

Servicios de autenticación:

```javascript
import { loginUser, registerUser, logoutUser } from "@/services/authService";

// Login
const result = await loginUser({ email, password });

// Registro
const result = await registerUser({ userName, email, password });

// Logout
await logoutUser();
```

### chatService

Servicios de chat:

```javascript
import { getRooms, getMessages, sendMessage } from "@/services/chatService";

// Obtener salas
const rooms = await getRooms();

// Obtener mensajes
const messages = await getMessages(roomId);

// Enviar mensaje
await sendMessage(roomId, content);
```

### riotService

Servicios de Riot Games API:

```javascript
import { syncProfile, getPlayerStats } from "@/services/riotService";

// Sincronizar perfil
await syncProfile({ gameName, tagLine, region });

// Obtener estadísticas
const stats = await getPlayerStats(gameName, tagLine);
```

## 📜 Scripts

### Desarrollo

```bash
npm run dev          # Inicia servidor de desarrollo
npm run dev:lan      # Inicia servidor accesible en red local
```

### Producción

```bash
npm run build        # Construye la aplicación para producción
npm run preview      # Previsualiza la build de producción
```

### Linting

```bash
npm run lint         # Ejecuta ESLint
```

### Testing

```bash
npm test             # Ejecuta tests unitarios con Vitest
npm run test:ui       # Abre interfaz gráfica de Vitest
npm run test:coverage # Ejecuta tests con reporte de cobertura
npm run test:e2e      # Ejecuta tests E2E con Cypress (headless)
npm run test:e2e:open # Abre interfaz gráfica de Cypress
npm run test:e2e:headed # Ejecuta tests E2E con navegador visible
```

## 🎨 Estilos

### Tailwind CSS

El proyecto usa Tailwind CSS 4 con configuración personalizada:

- **Colores**: Paleta personalizada para la marca
- **Tipografía**: Fuente Montserrat Variable
- **Espaciado**: Sistema de espaciado consistente
- **Breakpoints**: Mobile-first responsive design

### Componentes UI

Los componentes UI están construidos con Radix UI y estilizados con Tailwind, siguiendo el patrón de shadcn/ui.

### Tema

Soporte para tema claro/oscuro mediante `next-themes`:

```javascript
import { useTheme } from "next-themes";

const { theme, setTheme } = useTheme();
```

## 🔒 Autenticación

### Flujo de Autenticación

1. Usuario ingresa credenciales en `/login`
2. `authService.loginUser()` hace petición al backend
3. Backend establece cookie `authToken` (httpOnly)
4. `AuthContext` actualiza el estado del usuario
5. Usuario es redirigido a `/start/statistics`

### Verificación de Sesión

Al cargar la aplicación, `useSessionCheck` verifica automáticamente si hay una sesión activa:

- Hace petición a `/api/auth/check-session`
- Si hay sesión válida, carga los datos del usuario
- Si no hay sesión, mantiene el estado de no autenticado

### Protección de Rutas

Las rutas protegidas usan `PrivateRoute`:

```jsx
<Route
  path="/start/squads"
  element={
    <PrivateRoute>
      <Squads />
    </PrivateRoute>
  }
/>
```

## 🌐 WebSockets

### Conexión

La conexión WebSocket se establece automáticamente al autenticarse:

```javascript
// En SocketContext
useEffect(() => {
  if (isAuthenticated) {
    socket.connect();
  } else {
    socket.disconnect();
  }
}, [isAuthenticated]);
```

### Eventos

**Chat:**

- `join-room` - Unirse a sala
- `leave-room` - Salir de sala
- `send-message` - Enviar mensaje
- `new-message` - Recibir mensaje

**Notificaciones:**

- `notification` - Nueva notificación
- `squad-invitation` - Invitación a squad
- `match-request` - Solicitud de match

## 📱 Responsive Design

La aplicación es completamente responsive:

- **Mobile**: < 768px - Sidebar colapsable, diseño vertical
- **Tablet**: 768px - 1024px - Layout adaptativo
- **Desktop**: > 1024px - Sidebar fija, layout completo

Hook personalizado para detección móvil:

```javascript
import { useIsMobile } from "@/hooks/use-mobile";

const isMobile = useIsMobile();
```

## 🐛 Troubleshooting

### Error de conexión al backend

- Verificar que `VITE_API_URL` esté correctamente configurada
- Verificar que el backend esté corriendo
- Revisar CORS en el backend

### Error de WebSocket

- Verificar que el backend tenga Socket.io configurado
- Revisar la URL de conexión en `SocketContext`
- Verificar que el path `/socket.io` esté disponible

### Problemas de autenticación

- Verificar que las cookies se estén enviando (credentials: 'include')
- Revisar la configuración de CORS en el backend
- Verificar que el token JWT sea válido

### Errores en tests de Cypress

- **Overlay bloqueando capturas**: El overlay está desactivado en `vite.config.js`. Si aparece, usa el comando `cy.removeViteOverlay()`
- **Splash screen en tests**: Se desactiva automáticamente. Si no, usa `cy.disableSplashScreen()`
- **Errores de dayjs**: Se ignoran automáticamente en los tests. No bloquean la ejecución

## 📝 Notas Adicionales

- El proyecto usa Vite, por lo que las variables de entorno deben tener el prefijo `VITE_`
- Los componentes UI están en `src/components/ui/` y siguen el patrón de shadcn/ui
- El sistema de notificaciones usa `sonner` para toasts
- Las imágenes se optimizan automáticamente con Vite
- **Splash Screen**: Se desactiva automáticamente durante tests de Cypress (detecta `window.Cypress`)
- **Overlay de Errores**: Desactivado en configuración de Vite para no bloquear capturas de Cypress
- **Manejo de dayjs**: Inicialización segura con fallback si hay errores de carga de módulos

## 🔑 Funcionalidades Clave del Proyecto

### Autenticación y Seguridad

- Registro con verificación de email
- Login con JWT y cookies httpOnly
- Recuperación de contraseña
- Autenticación de dos factores (2FA)
- Gestión de sesiones activas

### Integración con Riot Games

- Sincronización de perfil de invocador
- Estadísticas de partidas clasificatorias
- Historial de partidas recientes
- Información de ranking y ligas

### Comunicación

- Chat en tiempo real por WebSockets
- Notificaciones push
- Mensajes privados entre usuarios

### Gestión de Equipos

- Creación y gestión de squads
- Invitaciones a equipos
- Perfiles de squad con estadísticas agregadas

## 🧪 Testing

El proyecto incluye una suite completa de tests con **Vitest** para tests unitarios y **Cypress** para tests end-to-end (E2E).

### Tests Unitarios (Vitest)

Los tests unitarios están ubicados junto a los archivos que prueban, siguiendo la convención `*.test.{js,ts,tsx}`.

**Estructura de tests:**

```
src/
├── lib/
│   ├── utils.ts
│   └── utils.test.ts              # Tests de utilidades
├── services/
│   ├── apiService.js
│   └── apiService.test.js         # Tests de servicios API
├── components/
│   └── ui/
│       ├── button.tsx
│       └── button.test.tsx        # Tests de componentes UI
└── test/
    └── setup.js                    # Configuración global de tests
```

**Tests implementados:**

- ✅ **Utils**: Función `cn` para merge de clases CSS
- ✅ **Services**: Funciones `normalizeUrl` y `parseError` de `apiService`
- ✅ **Components**: Componente `Button` con diferentes variantes y estados

**Ejecutar tests unitarios:**

```bash
# Ejecutar todos los tests
npm test

# Modo watch (ejecuta tests al cambiar archivos)
npm test -- --watch

# Interfaz gráfica interactiva
npm run test:ui

# Con reporte de cobertura
npm run test:coverage
```

**Configuración:**

- Archivo de configuración: `vitest.config.js`
- Entorno: `jsdom` para simular DOM del navegador
- Setup: `src/test/setup.js` con configuración de Testing Library
- Alias: Soporte para alias `@/` igual que en Vite

### Tests E2E (Cypress)

Los tests end-to-end verifican el comportamiento completo de la aplicación desde la perspectiva del usuario.

**Estructura de tests E2E:**

```
cypress/
├── e2e/
│   ├── app.cy.js                  # Tests de navegación principal
│   └── navigation.cy.js           # Tests de navegación
├── support/
│   └── e2e.js                     # Comandos y configuración global
├── screenshots/                   # Capturas de pantalla automáticas
└── config.js                      # Configuración de Cypress
```

**Tests implementados:**

- ✅ **App Navigation**: Carga de la aplicación sin splash screen
- ✅ **Navigation**: Navegación entre páginas y elementos de UI

**Características especiales:**

- **Splash screen desactivado**: Los tests desactivan automáticamente el splash screen para facilitar las capturas
- **Manejo de errores**: Configuración para ignorar errores de módulos que no bloquean el render
- **Eliminación de overlay**: Comando personalizado para eliminar el overlay de errores de Vite

**Ejecutar tests E2E:**

```bash
# Ejecutar tests en modo headless
npm run test:e2e

# Abrir interfaz gráfica de Cypress (recomendado para desarrollo)
npm run test:e2e:open

# Ejecutar con navegador visible
npm run test:e2e:headed
```

**Configuración especial:**

- **Overlay desactivado**: El overlay de errores de Vite está desactivado para no bloquear las capturas
- **Splash screen desactivado**: Se desactiva automáticamente durante los tests mediante `sessionStorage`
- **Comandos personalizados**:
  - `cy.disableSplashScreen()`: Desactiva el splash screen
  - `cy.removeViteOverlay()`: Elimina el overlay de errores de Vite
- **Manejo de errores**: Errores de dayjs y resolución de módulos se ignoran automáticamente

**Nota:** Los tests E2E requieren que el servidor de desarrollo esté corriendo (`npm run dev`).

### Cobertura de Tests

La configuración actual incluye tests mínimos para demostrar la herramienta. Se recomienda expandir la cobertura según las necesidades del proyecto:

- **Componentes críticos**: Formularios de autenticación, componentes de chat
- **Servicios**: Llamadas API, manejo de errores
- **Utilidades**: Funciones de transformación de datos
- **Flujos E2E**: Autenticación completa, creación de squads, envío de mensajes

### Configuración Especial para Tests

**Manejo de errores durante tests:**
- Errores de módulos (dayjs, resolución) se ignoran automáticamente
- Overlay de Vite desactivado en configuración y eliminado automáticamente
- Splash screen desactivado durante tests para facilitar capturas

**Archivos de configuración relacionados:**
- `vite.config.js`: Overlay desactivado, optimización de dayjs
- `cypress.config.js`: Configuración de timeouts y manejo de errores
- `cypress/support/e2e.js`: Comandos personalizados y manejo global de errores
- `src/main.jsx`: Eliminación automática de overlay en cliente
- `src/App.jsx`: Detección de Cypress para desactivar splash screen

## 📚 Documentación

Para más información sobre la arquitectura del sistema, consulta:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura completa del sistema, patrones de diseño y flujos de datos
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Guía de contribución y estándares de código

## 🧑‍💻 Autores

- **Aimón Pérez**
- **José Hernández**
- **Mariano Luna** - [GitHub](https://github.com/marianorluna)

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
