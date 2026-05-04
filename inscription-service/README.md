# Inscription Service

Servicio de gestión de inscripciones para estudiantes de tiro al arco.

## Endpoints

### Inscripciones

- `POST /api/inscriptions` - Crear nueva inscripción
- `GET /api/inscriptions` - Obtener todas las inscripciones
- `GET /api/inscriptions/:id` - Obtener inscripción por ID
- `PUT /api/inscriptions/:id` - Actualizar inscripción
- `DELETE /api/inscriptions/:id` - Eliminar inscripción
- `GET /api/inscriptions/status/:status` - Obtener inscripciones por estado

## Status

- `pending` - Pendiente de aprobación
- `approved` - Aprobada
- `rejected` - Rechazada
