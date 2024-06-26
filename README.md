# Proyecto de autenticación

Este proyecto es una API RESTful construida con Express para registrar, editar, eliminar y visualizar usuarios en una base de datos. La API valida los parámetros de entrada, verifica la existencia del usuario, encripta la contraseña antes de almacenar al usuario en la base de datos entre otras.

# Instalación

- git clone https://github.com/SerapioUnlucky/auth-app.git
- cd auth-app
- npm install
- npm run dev

# Comandos de docker

## Redes

- docker network create auth-app

## Base de datos

- docker pull mongo
- docker create -p27017:27017 --name monguito --network auth-app -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=password mongo
- docker start monguito

## API

- docker build -t auth-app:1 .
- docker create -p3000:3000 --name auth-app --network auth-app auth-app:1
- docker start auth-app

# Endpoints http://{server}/api/user

## POST /register

Crea un usuario en la base de datos.

### Request

```json
{
  "name": "Sebastián",
  "lastname": "Jerez",
  "username": "SerapioUnlucky",
  "password": "123456",
  "birthday": "1995-10-05",
  "age" : 25,
}
```

### Response

```json
{
  "message": "Usuario registrado con éxito",
  "user": {
    "_id": "5f7b3b3b7b3b3b3b3b3b3b3b",
    "name": "Sebastián",
    "lastname": "Jerez",
    "username": "SerapioUnlucky",
    "password": "$2b$10$3",
    "birthday": "1995-10-05T00:00:00.000Z",
    "age": 25
  }
}
```

## POST /login

Inicia sesión en la aplicación.

### Request

```json
{
  "username": "SerapioUnlucky",
  "password": "123456"
}
```

### Response

```json
{
  "message": "Inicio de sesión exitoso",
  "user": {
    "_id": "5f7b3b3b7b3b3b3b3b3b3b3b",
    "username": "SerapioUnlucky"
  }
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNlcmFwaW9Vbmx1Y2t5IiwiaWF0IjoxNjAxMjIwNjI5LCJleHAiOjE2MDEyMjQyMjl9.3"
}
```

## GET /profile/:id

Obtiene un usuario por su id.

### Response

```json
{
  "user": {
    "_id": "5f7b3b3b7b3b3b3b3b3b3b3b",
    "name": "Sebastián",
    "lastname": "Jerez",
    "username": "SerapioUnlucky",
    "password": "$2b$10$3",
    "birthday": "1995-10-05T00:00:00.000Z",
    "age": 25
  }
}
```

## GET /users

Obtiene todos los usuarios registrados.

### Response

```json
{
  "users": [
    {
      "_id": "5f7b3b3b7b3b3b3b3b3b3b3b",
      "name": "Sebastián",
      "lastname": "Jerez",
      "username": "SerapioUnlucky",
      "password": "$2b$10$3",
      "birthday": "1995-10-05T00:00:00.000Z",
      "age": 25
    }
  ]
}
```

## DELETE /delete/:id

Elimina un usuario por su id.

### Response

```json
{
  "message": "Usuario eliminado con éxito",
  "user": {
    "_id": "5f7b3b3b7b3b3b3b3b3b3b3b",
    "name": "Sebastián",
    "lastname": "Jerez",
    "username": "SerapioUnlucky",
    "password": "$2b$10$3",
    "birthday": "1995-10-05T00:00:00.000Z",
    "age": 25
  }
}
```

## PUT /update/:id

Actualiza un usuario por su id.

### Request

```json
{
  "name": "Sebastián",
  "lastname": "Jerez",
  "username": "SerapioUnlucky",
  "password": "123456",
  "birthday": "1995-10-05",
  "age" : 25
}
```

### Response

```json
{
  "message": "Usuario actualizado con éxito",
  "user": {
    "_id": "5f7b3b3b7b3b3b3b3b3b3b3b",
    "name": "Sebastián",
    "lastname": "Jerez",
    "username": "SerapioUnlucky",
    "password": "$2b$10$3",
    "birthday": "1995-10-05T00:00:00.000Z",
    "age": 25
  }
}
```

# Tecnologías

- Node
- Express
- MongoDB
- Docker
- JWT
- Bcrypt
- Driver nativo de MongoDB
- Jest
- Joi
- Pino (logs)
