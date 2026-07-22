# Modelo de Datos

## User
```json
{
  "_id": "ObjectId",
  "nombre": "String (required)",
  "email": "String (required, unique)",
  "password": "String (required, hashed with bcrypt)",
  "rol": "String (enum: 'administrador', 'estudiante', default: 'estudiante')",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Course
```json
{
  "_id": "ObjectId",
  "titulo": "String (required)",
  "descripcion": "String (required)",
  "profesor": "ObjectId (ref: 'Profesor')",
  "estudiantes": ["ObjectId (ref: 'User')"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Profesor
```json
{
  "_id": "ObjectId",
  "nombre": "String (required)",
  "especialidad": "String (required)",
  "correo": "String (required, unique)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Relaciones
- Un Course pertenece a un Profesor (1:N)
- Un Course tiene muchos Estudiantes (N:M)
- Un User puede estar inscrito en muchos Courses (N:M)
