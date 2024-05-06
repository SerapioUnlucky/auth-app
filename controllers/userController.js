const User = require('../models/userModel');
const logger = require('../services/pino');
const bcrypt = require('bcrypt');
const jwt = require('../services/token');
const { registerSchema } = require('../helpers/validationHelper');
const collection = 'users';

const register = async (db, req, res) => {

    const params = req.body;
    const user = new User(params.name, params.lastname, params.username, params.password, params.birthdate, params.age);

    try {

        const validationResult = registerSchema.validate(params);

        if (validationResult.error) {

            logger.error(validationResult.error.details[0].message);
            return res.status(400).json({ message: validationResult.error.details[0].message });

        }

        const userExists = await db.collection(collection).findOne({ username: params.username });

        if (userExists) {

            logger.error('El usuario ya existe en la base de datos');
            return res.status(400).json({ message: 'El usuario ya existe' });

        }

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

    const params = req.body;

    try {

        const user = await db.collection(collection).findOne({ username: params.username });

        if (!user) {

            logger.error('Usuario no esta registrado en la base de datos');
            return res.status(404).json({ message: 'Usuario no encontrado' });

        }

        const match = await bcrypt.compare(params.password, user.password);

        if (!match) {

            logger.error('Contraseña ingresa es incorrecta');
            return res.status(401).json({ message: 'Contraseña incorrecta' });

        }

        const token = jwt.createToken(user);

        logger.info('Usuario autenticado con éxito');
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

        const username = req.user.username;
        const user = await db.collection(collection).findOne({ username: username });

        if (!user) {

            logger.error('El usuario no se encuentra registrado en la base de datos');
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });

        }

        logger.info('Usuario obtenido con éxito');
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
