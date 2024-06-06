const User = require('../models/userModel');
const logger = require('../helpers/pino');
const jwt = require('../services/token');
const method = require('../helpers/methods');
const collection = 'users';
const { registerSchema } = require('../helpers/validation');
const { ObjectId } = require('mongodb');

const register = async (db, req, res) => {

    try {

        const params = req.body;
        
        logger.trace('Ingresando a la funcion de registro con los siguientes parametros: ');
        logger.trace({ params });

        logger.trace('Validando los parametros ingresados para el registro');
        const validationResult = registerSchema.validate(params);

        if (validationResult.error) {

            logger.error(validationResult.error.details[0].message);
            return res.status(400).json({ message: validationResult.error.details[0].message });

        }

        logger.trace(`Validacion exitosa, buscando al usuario ${params.username} en la base de datos`);
        const userExists = await method.findOne(db, collection, { username: params.username });

        if (userExists) {

            logger.error('El usuario ya existe en la base de datos');
            return res.status(400).json({ message: 'El usuario ya existe' });

        }

        let user = new User(params.name, params.lastname, params.username, params.password, params.birthdate, params.age);

        logger.trace('Encriptando la contraseña del usuario y registrandolo en la base de datos');
        const pwd = await method.bcryptHash(user.password);
        user.password = pwd;

        await method.insertOne(db, collection, user);

        logger.info('El usuario se ha registrado con éxito');
        return res.status(201).json({
            message: 'Usuario registrado con éxito',
            user: user
        });

    } catch (error) {

        logger.error(error.message);
        return res.status(500).json({
            message: 'Error al registrar el usuario'
        });

    }

}

const login = async (db, req, res) => {

    try {

        const params = req.body;

        logger.trace('Ingresando a la funcion login con los siguientes parametros: ');
        logger.trace({ params })

        logger.trace(`Buscando al usuario ${params.username} en la base de datos`);
        const user = await method.findOne(db, collection, { username: params.username });

        if (!user) {

            logger.error(`El usuario ${params.username} no esta registrado en la base de datos`);
            return res.status(404).json({ message: 'Usuario no encontrado' });

        }

        logger.trace(`Usuario ${params.username} encontrado en la base de datos, comparando contrasenias`);
        const match = await method.bcryptCompare(params.password, user.password);

        if (!match) {

            logger.error('La contrasenia ingresada es incorrecta');
            return res.status(401).json({ message: 'Contraseña incorrecta' });

        }

        logger.trace('Contrasenia correcta, generando token de autenticacion');
        const token = jwt.createToken(user);

        logger.trace(`Autenticacion exitosa, retornando token de autenticacion para el usuario ${user.username}`);
        return res.status(200).json({
            message: 'Usuario autenticado con éxito',
            user: {
                id: user._id,
                username: user.username
            },
            token
        });

    } catch (error) {

        logger.error(error.message);
        return res.status(500).json({
            message: 'Error al autenticar el usuario'
        });

    }

}

const profile = async (db, req, res) => {

    try {

        const id = ObjectId.createFromHexString(req.params.id);

        logger.trace(`Buscando al usuario de id ${id} en la base de datos`);
        const user = await method.findOne(db, collection, { _id: id });

        if (!user) {

            logger.error('El usuario no se encuentra registrado en la base de datos');
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });

        }

        logger.trace(`Usuario obtenido con exito: ${user.username}`);
        return res.status(200).json({
            message: 'Usuario obtenido con éxito',
            user
        });

    } catch (error) {

        logger.error(error.message);
        return res.status(500).json({
            message: 'Error al obtener el usuario'
        });

    }

}

const users = async (db, req, res) => {

    try {

        logger.trace('Buscando todos los usuarios en la base de datos');
        const users = await method.find(db, collection);

        if (!users) {

            logger.error('No se encontraron usuarios en la base de datos');
            return res.status(404).json({
                message: 'No se encontraron usuarios'
            });

        }

        logger.trace('Usuarios obtenidos con exito');
        return res.status(200).json({
            message: 'Usuarios obtenidos con éxito',
            users
        });

    } catch (error) {

        logger.error(error.message);
        return res.status(500).json({
            message: 'Error al obtener los usuarios'
        });

    }

}

const deleted = async (db, req, res) => {

    try {

        const id = ObjectId.createFromHexString(req.params.id);

        logger.trace(`Buscando al usuario de id ${id} en la base de datos`);
        const user = await method.findOne(db, collection, { _id: id });

        if (!user) {

            logger.error('El usuario no se encuentra registrado en la base de datos');
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });

        }

        logger.trace(`Usuario obtenido con exito: ${user.username}, eliminando usuario de la base de datos`);
        await method.deleteOne(db, collection, { _id: id });

        logger.info('Usuario eliminado con exito');
        return res.status(200).json({
            message: 'Usuario eliminado con éxito',
            user
        });
        
    } catch (error) {

        logger.error(error.message);
        return res.status(500).json({
            message: 'Error al eliminar el usuario'
        });
        
    }

}

module.exports = {
    register,
    login,
    profile,
    users,
    deleted
};
