const jwt = require('jsonwebtoken');
const logger = require('../services/pino');
const secret = process.env.SECRET;

exports.auth = (req, res, next) => {

    if(!req.headers.authorization){

        logger.error('No esta adjuntado el token de autorizacion en el header');
        return res.status(403).json({
            message: 'No tienes autorización'
        });

    }

    let token = req.headers.authorization.replace(/['"]+/g, '');

    try {

        let payload = jwt.verify(token, secret);

        if (payload.exp <= Date.now()) {

            logger.error('El token ha expirado');
            return res.status(403).json({
                message: 'El token ha expirado'
            });

        }

        req.user = payload;

        next();
        
    } catch (error) {

        logger.error('El token ya no es válido');
        return res.status(403).json({
            message: 'No tienes autorización'
        });
        
    }

}
