# 🏗 Arquitectura del Sistema - LoL Match

Documentación técnica que describe la arquitectura, patrones de diseño y componentes principales del sistema LoL Match.

## 📋 Tabla de Contenidos

- [Arquitectura General](#-arquitectura-general)
- [Backend Architecture](#-backend-architecture)
- [Frontend Architecture](#-frontend-architecture)
- [Flujo de Datos](#-flujo-de-datos)
- [Patrones de Diseño](#-patrones-de-diseño)
- [Componentes Clave](#-componentes-clave)
- [Integraciones](#-integraciones)
- [Testing](#-testing)

## 🏛 Arquitectura General

LoL Match sigue una arquitectura **cliente-servidor** con separación clara entre frontend y backend:

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│    Frontend     │◄───────►│    Backend      │◄───────►│   MongoDB       │
│   (React/Vite)  │  HTTP   │  (Node/Express) │  ODM    │   (Database)    │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
       │                            │                            │
       │                            │                            │
       │                            ▼                            │
       │                   ┌─────────────────┐                   │
       │                   │   Socket.io     │                   │
       │                   │  (WebSockets)   │                   │
       │                   └─────────────────┘                   │
       │                                                         │
       ▼                                                         ▼
┌─────────────────┐                                     ┌─────────────────┐
│                 │                                     │                 │
│  Riot Games API │                                     │   Cloudinary    │
│   (External)    │                                     │  (File Storage) │
│                 │                                     │                 │
└─────────────────┘                                     └─────────────────┘
```

### Características Principales

- **Separación de responsabilidades**: Frontend y backend completamente independientes
- **API RESTful**: Comunicación mediante endpoints REST estándar
- **WebSockets**: Comunicación bidireccional en tiempo real
- **Base de datos NoSQL**: MongoDB para flexibilidad en esquemas
- **Autenticación basada en tokens**: JWT almacenado en cookies httpOnly

## 🔧 Backend Architecture

### Estructura en Capas

El backend sigue una arquitectura en capas (Layered Architecture):

```
┌─────────────────────────────────────────────────────────┐
│                    Routes Layer                          │
│  (Definición de endpoints y validación de entrada)      │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Controllers Layer                       │
│  (Lógica de negocio y orquestación de servicios)        │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Services Layer                          │
│  (Servicios externos: Riot API, Email, etc.)            │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Models Layer                            │
│  (Esquemas de Mongoose y acceso a datos)                │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Database Layer                          │
│  (MongoDB - Persistencia de datos)                      │
└─────────────────────────────────────────────────────────┘
```

### Flujo de Request

1. **Request llega a Route** → Validación con Zod/express-validator
2. **Route llama a Controller** → Lógica de negocio
3. **Controller usa Services** → Llamadas a APIs externas si es necesario
4. **Controller interactúa con Models** → Operaciones CRUD
5. **Model persiste en Database** → MongoDB
6. **Response se envía al cliente** → JSON con datos o errores

### Middlewares

Los middlewares se ejecutan en el siguiente orden:

```
Request → CORS → JSON Parser → Cookie Parser → Auth Middleware → Route Handler
```

**Middlewares principales:**

- **CORS**: Control de acceso cross-origin
- **JSON Parser**: Parseo de bodies JSON
- **Cookie Parser**: Lectura de cookies
- **Auth Middleware**: Verificación de JWT
- **Timezone Middleware**: Normalización de zonas horarias

### WebSockets

Socket.io se integra con Express en el mismo servidor HTTP:

```javascript
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: allowedOrigins } });
```

**Eventos principales:**

- **Chat**: `join-room`, `leave-room`, `send-message`, `new-message`
- **Notificaciones**: `notification`, `squad-invitation`, `match-request`

## 🎨 Frontend Architecture

### Arquitectura de Componentes

El frontend sigue una arquitectura basada en componentes con Context API:

```
┌─────────────────────────────────────────────────────────┐
│                    App Component                         │
│  (Punto de entrada, rutas principales)                  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Context Providers                       │
│  (Auth, Socket, Chat, Notifications)                    │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Layout Components                       │
│  (AppLayout, AuthLayout)                                 │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Page Components                         │
│  (Statistics, Squads, Profile, etc.)                    │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              Business Components                         │
│  (UserCard, SquadCard, ChatRoom, etc.)                  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  UI Components                           │
│  (Button, Input, Dialog, etc. - Radix UI)                │
└─────────────────────────────────────────────────────────┘
```

### Gestión de Estado

**Context API** para estado global:

- **AuthContext**: Estado de autenticación y usuario
- **SocketContext**: Conexión WebSocket
- **ChatContext**: Estado del chat
- **NotificationContext**: Notificaciones

**Estado Local** con React Hooks:

- `useState` para estado de componentes
- `useEffect` para efectos secundarios
- Custom hooks para lógica reutilizable

### Servicios

Los servicios encapsulan la comunicación con el backend:

```
Services Layer
├── apiService.js      (Cliente HTTP base con interceptor de autenticación)
├── authService.js     (Autenticación)
├── chatService.js     (Chat)
└── riotService.js     (Riot Games API)
```

### Utilidades de Autenticación

El sistema incluye utilidades para manejo centralizado de autenticación:

```
Utils Layer
└── authInterceptor.js (Manejo de errores 401 y limpieza de cookies)
```

**Funcionalidades:**
- Limpieza automática de cookies cuando se detecta error 401
- Soporte para múltiples dominios (netlify.app y lolmatch.online)
- Manejo centralizado de errores de autenticación

## 🔄 Flujo de Datos

### Autenticación

```
1. Usuario ingresa credenciales
   ↓
2. Frontend: authService.loginUser()
   ↓
3. Backend: POST /api/auth/login
   ↓
4. Backend: Verifica credenciales → Genera JWT
   ↓
5. Backend: Establece cookie httpOnly con token
   ↓
6. Frontend: AuthContext actualiza estado
   ↓
7. Frontend: Redirige a página principal
```

### Chat en Tiempo Real

```
1. Usuario envía mensaje
   ↓
2. Frontend: Socket.emit('send-message', data)
   ↓
3. Backend: Socket handler procesa mensaje
   ↓
4. Backend: Guarda mensaje en DB
   ↓
5. Backend: Socket.broadcast('new-message', data)
   ↓
6. Frontend: Socket.on('new-message') → Actualiza UI
```

### Sincronización de Perfil Riot

```
1. Usuario ingresa gameName y tagLine
   ↓
2. Frontend: riotService.syncProfile()
   ↓
3. Backend: POST /api/lol/sync-profile
   ↓
4. Backend: riotApi.getFullPlayerStats()
   ↓
5. Backend: Llamada a Riot Games API
   ↓
6. Backend: Procesa y guarda datos en User.lolProfile
   ↓
7. Frontend: Actualiza perfil del usuario
```

## 🎯 Patrones de Diseño

### Backend

1. **MVC (Model-View-Controller)**

   - Models: Esquemas de Mongoose
   - Controllers: Lógica de negocio
   - Routes: Vistas (endpoints)

2. **Repository Pattern** (implícito)

   - Models encapsulan acceso a datos
   - Controllers no acceden directamente a DB

3. **Service Layer Pattern**

   - Servicios externos separados (Riot API, Email)
   - Reutilización y testabilidad

4. **Middleware Pattern**

   - Funciones intermedias para procesamiento
   - Autenticación, validación, logging

5. **DTO Pattern**
   - Data Transfer Objects para formatear respuestas
   - Separación entre modelo interno y API externa

### Frontend

1. **Component Composition**

   - Componentes pequeños y reutilizables
   - Composición sobre herencia

2. **Container/Presentational Pattern**

   - Containers: Lógica y estado
   - Presentational: UI pura

3. **Custom Hooks Pattern**

   - Lógica reutilizable en hooks
   - Separación de concerns

4. **Context Pattern**

   - Estado global compartido
   - Evita prop drilling

5. **Service Layer Pattern**
   - Servicios encapsulan llamadas API
   - Separación de lógica de negocio

## 🔑 Componentes Clave

### Backend

#### AuthController

Gestiona toda la lógica de autenticación:

- Registro con verificación de email
- Login con JWT y gestión de sesiones
- Recuperación de contraseña
- Autenticación de dos factores
- Gestión de sesiones activas

**Dependencias:**

- `User` model
- `Session` model
- `generateToken` utility
- Email services

#### RiotController

Integración con Riot Games API:

- Sincronización de perfiles
- Obtención de estadísticas
- Historial de partidas
- Información de ranking

**Dependencias:**

- `riotApi` service
- `cache` utility
- `User` model

#### ChatController

Gestión de mensajería:

- Creación de salas
- Envío de mensajes
- Conversaciones privadas
- Historial de mensajes

**Dependencias:**

- `ChatRoom` model
- `PrivateConversation` model
- Socket.io instance

### Frontend

#### AuthContext

Gestiona el estado de autenticación:

```javascript
// Funcionalidades principales
- Verificación automática de sesión
- Login y logout
- Actualización de datos de usuario
- Gestión de cookies
- Manejo automático de errores 401
- Limpieza de cookies en múltiples dominios
```

**Soporte Multi-Dominio:**
- Detecta automáticamente cuando la sesión expira (401)
- Limpia cookies del dominio actual y dominios anteriores
- Permite transición transparente entre dominios (netlify.app ↔ lolmatch.online)
- No requiere intervención del usuario al cambiar de dominio

**Hooks relacionados:**

- `useSessionCheck` - Verificación inicial
- `useLogoutWithModal` - Logout con confirmación

#### SocketContext

Maneja conexión WebSocket:

```javascript
// Funcionalidades principales
- Conexión/desconexión automática
- Reconexión en caso de error
- Eventos de conexión
- Integración con autenticación
```

#### ChatContext

Estado del chat:

```javascript
// Funcionalidades principales
- Gestión de salas activas
- Mensajes en tiempo real
- Conversaciones privadas
- Notificaciones de mensajes nuevos
```

## 🔌 Integraciones

### Riot Games API

**Endpoints utilizados:**

- `/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}` - Obtener PUUID
- `/lol/summoner/v4/summoners/by-puuid/{puuid}` - Información de invocador
- `/lol/league/v4/entries/by-summoner/{summonerId}` - Ranking
- `/lol/match/v5/matches/by-puuid/{puuid}/ids` - IDs de partidas
- `/lol/match/v5/matches/{matchId}` - Detalles de partida

**Características:**

- Sistema de caché para optimizar llamadas
- Soporte para múltiples regiones
- Manejo de rate limits
- Transformación de datos a formato interno

### Cloudinary

**Uso:**

- Almacenamiento de avatares de usuario
- Almacenamiento de imágenes de squads
- Optimización automática de imágenes
- URLs CDN para carga rápida

**Integración:**

- Multer para upload de archivos
- `multer-storage-cloudinary` para almacenamiento directo
- Transformaciones automáticas (resize, format)

### Brevo (Sendinblue)

**Uso:**

- Emails de verificación de cuenta
- Emails de recuperación de contraseña
- Notificaciones de seguridad
- Códigos de autenticación de dos factores

**Templates:**

- Email de bienvenida
- Verificación de cuenta
- Recuperación de contraseña
- Código 2FA
- Notificaciones de seguridad

## 🔐 Seguridad

### Autenticación

- **JWT Tokens**: Almacenados en cookies httpOnly
- **Expiración**: Tokens con tiempo de vida limitado
- **Refresh**: Renovación automática de tokens
- **Sesiones**: Gestión de múltiples sesiones por usuario

### Validación

- **Zod**: Validación de esquemas en backend
- **express-validator**: Validación de requests HTTP
- **React Hook Form + Zod**: Validación en frontend

### Seguridad de Datos

- **Bcrypt**: Hash de contraseñas (10 rounds)
- **Sanitización**: Limpieza de inputs de usuario
- **CORS**: Control de orígenes permitidos
- **Rate Limiting**: Protección contra abuso (implementable)

## 📊 Base de Datos

### Modelos Principales

#### User

```javascript
{
  userName: String (único, requerido)
  email: String (único, requerido)
  password: String (hasheado)
  role: Enum ['user', 'moderator', 'admin']
  avatar: String (URL)
  isVerified: Boolean
  lolProfile: {
    gameName: String
    tagLine: String
    puuid: String
    region: String
    ranks: Object
    stats: Object
    mySquad: ObjectId (ref: Squad)
  }
  matches: [ObjectId] (ref: User)
  security: {
    twoFactorEnabled: Boolean
    isLoginNotification: Boolean
  }
  sessions: [ObjectId] (ref: Session)
}
```

#### Squad

```javascript
{
  name: String (único, requerido)
  description: String
  avatar: String (URL)
  members: [ObjectId] (ref: User)
  maxMembers: Number
  isPublic: Boolean
  requirements: {
    minRank: String
    minLevel: Number
  }
  stats: Object
}
```

#### Session

```javascript
{
  userId: ObjectId (ref: User)
  tokenHash: String
  device: String
  ip: String
  lastActivity: Date
  createdAt: Date
}
```

### Relaciones

- **User ↔ Squad**: Many-to-One (un usuario puede estar en un squad)
- **User ↔ User**: Many-to-Many (matches entre usuarios)
- **User ↔ Session**: One-to-Many (múltiples sesiones por usuario)
- **Squad ↔ User**: One-to-Many (múltiples usuarios en un squad)

## 🧪 Testing

### Estrategia de Testing

El proyecto implementa una estrategia de testing en múltiples niveles:

```
┌─────────────────────────────────────────────────────────┐
│                  Tests E2E (Cypress)                     │
│  (Flujos completos de usuario, integración)            │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              Tests Unitarios (Vitest)                    │
│  (Componentes, servicios, utilidades)                   │
└─────────────────────────────────────────────────────────┘
```

### Tests Unitarios (Vitest)

**Herramientas:**
- **Vitest**: Framework de testing rápido y compatible con Vite
- **Testing Library**: Utilidades para testing de componentes React
- **jsdom**: Entorno DOM simulado para tests

**Estructura:**
- Tests ubicados junto a los archivos fuente (`*.test.{js,ts,tsx}`)
- Setup global en `src/test/setup.js`
- Configuración en `vitest.config.js`

**Cobertura actual:**
- ✅ Utilidades (`lib/utils.ts`) - función `cn` para merge de clases
- ✅ Servicios API (`services/apiService.js`) - `normalizeUrl` y `parseError`
- ✅ Componentes UI (`components/ui/button.tsx`) - renderizado, variantes, estados

**Ejemplo de test:**

```typescript
// src/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });
});
```

### Tests E2E (Cypress)

**Herramientas:**
- **Cypress**: Framework de testing E2E con interfaz gráfica
- **Time-travel debugging**: Capacidad de ver el estado en cada paso

**Estructura:**
- Tests en `cypress/e2e/`
- Configuración en `cypress.config.js` (compatible con ES modules)
- Comandos personalizados en `cypress/support/e2e.js`
- Capturas automáticas en `cypress/screenshots/`

**Comandos personalizados disponibles:**
- `cy.disableSplashScreen()`: Desactiva el splash screen estableciendo sessionStorage
- `cy.removeViteOverlay()`: Elimina el overlay de errores de Vite del DOM

**Cobertura actual:**
- ✅ Carga de aplicación (sin splash screen en tests)
- ✅ Navegación básica
- ✅ Manejo de errores sin bloquear render

**Características especiales:**
- Splash screen se desactiva automáticamente durante tests
- Overlay de errores de Vite eliminado para capturas limpias
- Manejo de errores de módulos (dayjs, resolución de módulos) sin bloquear tests
- Comandos personalizados: `disableSplashScreen()`, `removeViteOverlay()`

**Ejemplo de test:**

```javascript
// cypress/e2e/app.cy.js
describe('App Navigation', () => {
  beforeEach(() => {
    cy.visit('/', {
      failOnStatusCode: false,
      onBeforeLoad(win) {
        win.sessionStorage.setItem('splashShown', 'open');
      },
    });
    cy.disableSplashScreen();
  });

  it('should load the app without splash screen', () => {
    cy.removeViteOverlay();
    cy.get('body').should('be.visible');
    cy.screenshot('app-loaded-no-splash');
  });
});
```

### Integración en CI/CD

Los tests están diseñados para ejecutarse en pipelines de CI/CD:

```yaml
# Ejemplo de configuración CI
- name: Run unit tests
  run: npm test

- name: Run E2E tests
  run: npm run test:e2e
```

## 🚀 Optimizaciones

### Backend

- **Caché**: Sistema de caché para llamadas a Riot API
- **Índices**: Índices en campos frecuentemente consultados
- **Paginación**: Paginación en listados grandes
- **Lazy Loading**: Carga diferida de relaciones

### Frontend

- **Code Splitting**: División de código por rutas
- **Lazy Loading**: Carga diferida de componentes
- **Memoización**: React.memo y useMemo para optimización
- **Image Optimization**: Optimización automática con Vite
- **Error Handling**: Manejo seguro de errores de módulos (dayjs) sin bloquear render
- **Testing Integration**: Configuración para tests que no interfieren con desarrollo

## 📝 Notas Finales

- La arquitectura está diseñada para ser escalable y mantenible
- La separación de concerns facilita el testing
- Los patrones utilizados son estándar en la industria
- La documentación del código facilita la colaboración

---

**Última actualización**: 2024
