# Arc-Prestige
# Arc-Prestige
# Archery System

Sistema basado en **microservicios** para la gestión de autenticación, clases, inscripciones y reportes para una plataforma de tiro con arco.

El proyecto está dividido en varios servicios independientes que se comunican entre sí y permiten escalar la aplicación de forma modular.

---

# Arquitectura del Proyecto

El sistema está compuesto por los siguientes microservicios:

```
Archery
│
├── auth-service            # Servicio de autenticación (ASP.NET Core)
├── class-service           # Gestión de clases
├── inscription-service     # Gestión de inscripciones
├── report-service          # Generación de reportes
├── postgre_db              # Configuración de base de datos
```

Cada servicio funciona de manera independiente y tiene su propio contenedor Docker.

---

# Tecnologías Utilizadas

### Backend

* .NET 8 (Auth Service)
* Node.js
* Express.js

### Base de datos

* PostgreSQL

### Infraestructura

* Docker
* Docker Compose

### Otros

* JWT Authentication
* Entity Framework Core
* Arquitectura por capas
* Microservicios

---

# Microservicios

## 1. Auth Service

Servicio encargado de la **autenticación y gestión de usuarios**.

### Funcionalidades

* Registro de usuarios
* Login
* Generación de JWT
* Verificación de correo
* Recuperación de contraseña
* Gestión de roles
* Gestión de perfiles de usuario

### Arquitectura

El servicio está organizado en capas:

```
AuthService.Api
AuthService.Application
AuthService.Domain
AuthService.Persistence
```

### Descripción de capas

**Api**

* Punto de entrada del servicio
* Configuración de endpoints
* Configuración de dependencias

**Application**

* Lógica de negocio
* Servicios
* DTOs
* Interfaces

**Domain**

* Entidades del dominio
* Interfaces de repositorios
* Constantes y enums

**Persistence**

* Implementación de repositorios
* DbContext
* Migraciones
* Acceso a datos

---

## 2. Class Service

Servicio encargado de la **gestión de clases**.

### Funcionalidades

* Crear clases
* Listar clases
* Actualizar clases
* Eliminar clases
* Gestión de participantes

### Estructura

```
src
 ├── controllers
 ├── middleware
 ├── models
 ├── routes
 ├── utils
 └── validators
```

---

## 3. Inscription Service

Servicio encargado de la **gestión de inscripciones de usuarios a clases**.

### Funcionalidades

* Crear inscripción
* Listar inscripciones
* Validar disponibilidad
* Control de participantes

---

## 4. Report Service

Servicio encargado de la **generación de reportes del sistema**.

### Funcionalidades

* Reporte de clases
* Reporte de inscripciones
* Reportes administrativos

---

# Base de Datos

Se utiliza **PostgreSQL** como sistema gestor de base de datos.

La configuración se encuentra en:

```
postgre_db/docker-compose.yml
```

---

# Seguridad

El sistema utiliza **JWT (JSON Web Tokens)** para autenticación.

Los servicios validan el token mediante middleware para proteger las rutas privadas.

---

# Estructura General de Endpoints

Ejemplos de endpoints:

### Auth

```
POST /auth/register
POST /auth/login
POST /auth/verify-email
POST /auth/forgot-password
```

### Classes

```
GET /classes
POST /classes
PUT /classes/:id
DELETE /classes/:id
```

### Inscriptions

```
POST /inscriptions
GET /inscriptions
```

### Reports

```
GET /reports/classes
GET /reports/inscriptions
```

---

# Autor

Proyecto desarrollado como parte de un sistema de gestión para **clases de tiro con arco** utilizando arquitectura basada en microservicios.
