# Task Manager - Aplicación Hexagonal con Bun y Elysia

Esta es una aplicación de gestión de tareas construida con arquitectura hexagonal, utilizando Bun como runtime y Elysia como framework web.

## Tecnologías Utilizadas

- **Runtime**: Bun
- **Framework Web**: Elysia
- **Frontend**: React + TailwindCSS
- **Autenticación**: JWT + Cookies
- **Hash de Contraseñas**: Argon2
- **Generación de IDs**: UUID

## Estructura del Proyecto

```
src/
├── domain/
│   ├── entities/
│   │   ├── Task.ts
│   │   └── User.ts
│   └── ports/
│       └── repositories/
│           ├── TaskRepository.ts
│           └── UserRepository.ts
├── infrastructure/
│   ├── http/
│   │   └── server.ts
│   └── repositories/
│       ├── InMemoryTaskRepository.ts
│       └── InMemoryUserRepository.ts
└── presentation/
    ├── components/
    │   ├── Calendar.tsx
    │   └── TaskList.tsx
    └── index.tsx
```

## Características

### Autenticación
- Registro de usuarios con email y contraseña
- Login con JWT y cookies
- Logout
- Hash seguro de contraseñas con Argon2

### Gestión de Tareas
- Crear nuevas tareas
- Listar tareas del usuario
- Actualizar tareas existentes
- Marcar tareas como completadas
- Eliminar tareas
- Vista de calendario con tareas

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
bun install
```

3. Instalar dependencias específicas:
```bash
bun add @node-rs/argon2 uuid @types/uuid
```

## Desarrollo

Para ejecutar el proyecto en modo desarrollo:

```bash
bun run dev
```

Esto iniciará:
- El servidor en `http://localhost:3000`
- El compilador del cliente en modo watch

## API Endpoints

### Autenticación

#### POST /api/auth/register
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}
```

#### POST /api/auth/login
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}
```

#### POST /api/auth/logout
No requiere body.

### Tareas

#### GET /api/tasks
Obtiene todas las tareas del usuario autenticado.

#### POST /api/tasks
```json
{
  "title": "Nueva tarea",
  "description": "Descripción de la tarea",
  "dueDate": "2024-03-20T00:00:00.000Z"
}
```

#### PUT /api/tasks/:id
```json
{
  "title": "Tarea actualizada",
  "description": "Nueva descripción",
  "dueDate": "2024-03-21T00:00:00.000Z",
  "completed": true
}
```

#### DELETE /api/tasks/:id
No requiere body.

## Arquitectura

El proyecto sigue una arquitectura hexagonal (ports and adapters) con tres capas principales:

1. **Domain**: Contiene las entidades y los puertos (interfaces) del dominio.
2. **Infrastructure**: Implementa los adaptadores y la infraestructura técnica.
3. **Presentation**: Maneja la interfaz de usuario y la presentación.

## Seguridad

- Contraseñas hasheadas con Argon2
- Autenticación mediante JWT
- Cookies HttpOnly para tokens
- Validación de propietario en operaciones de tareas

## Estado Actual

- ✅ Autenticación implementada
- ✅ CRUD de tareas
- ✅ Vista de calendario
- ✅ Persistencia en memoria
- ⏳ Persistencia en base de datos (pendiente)
- ⏳ Tests unitarios (pendiente)
- ⏳ Tests de integración (pendiente) 