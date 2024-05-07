const User = require('../models/userModel');
const logger = require('../services/pino');
const bcrypt = require('bcrypt');
const jwt = require('../services/token');
const { registerSchema } = require('../helpers/validationHelper');
const { ObjectId } = require('mongodb');
const collection = 'users';

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
        const userExists = await db.collection(collection).findOne({ username: params.username });

        if (userExists) {

            logger.error('El usuario ya existe en la base de datos');
            return res.status(400).json({ message: 'El usuario ya existe' });

        }

        let user = new User(params.name, params.lastname, params.username, params.password, params.birthdate, params.age);

        logger.trace('Encriptando la contraseña del usuario y registrandolo en la base de datos');
        const pwd = await bcrypt.hash(params.password, 10);
        user.password = pwd;

        await db.collection(collection).insertOne(user);

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
        const user = await db.collection(collection).findOne({ username: params.username });

        if (!user) {

            logger.error(`El usuario ${params.username} no esta registrado en la base de datos`);
            return res.status(404).json({ message: 'Usuario no encontrado' });

        }

        logger.trace(`Usuario ${params.username} encontrado en la base de datos, comparando contrasenias`);
        const match = await bcrypt.compare(params.password, user.password);

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

        const id = req.params.id;
        const objectId = new ObjectId(id);

        logger.trace(`Buscando al usuario de id ${id} en la base de datos`);
        const user = await db.collection(collection).findOne({ _id: objectId });

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

module.exports = {
    register,
    login,
    profile
};
