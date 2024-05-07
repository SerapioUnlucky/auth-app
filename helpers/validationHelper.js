const Joi = require('joi');

const registerSchema = Joi.object({

    name: Joi.string()
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s']+$/u)
        .required()
        .messages({
            'any.required': 'El nombre es obligatorio',
            'string.empty': 'El nombre no puede estar vacío',
            'string.pattern.base': 'El nombre solo puede contener letras'
        }),
    lastname: Joi.string()
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s']+$/u)
        .required()
        .messages({
            'any.required': 'El apellido es obligatorio',
            'string.empty': 'El apellido no puede estar vacío',
            'string.pattern.base': 'El apellido solo puede contener letras'
        }),
    username: Joi.string()
        .required()
        .regex(/^[a-zA-Z0-9]+$/)
        .messages({
            'any.required': 'El nombre de usuario es obligatorio',
            'string.empty': 'El nombre de usuario no puede estar vacío',
            'string.pattern.base': 'El nombre de usuario solo puede contener letras y números'
        }),
    password: Joi.string()
        .required()
        .messages({
            'any.required': 'La contraseña es obligatoria',
            'string.empty': 'La contraseña no puede estar vacía'
        }),
    birthdate: Joi.date()
        .required()
        .messages({
            'any.required': 'La fecha de nacimiento es obligatoria',
            'date.base': 'La fecha de nacimiento debe ser una fecha válida'
        }),
    age: Joi.number()
        .required()
        .integer()
        .messages({
            'any.required': 'La edad es obligatoria',
            'number.base': 'La edad debe ser un número',
            'number.integer': 'La edad debe ser un número entero'
        })

});

module.exports = {
    registerSchema
}
