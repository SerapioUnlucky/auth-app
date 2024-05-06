const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

exports.auth = (req, res, next) => {

    if(!req.headers.authorization){

        return res.status(403).json({
            message: 'No tienes autorización'
        });

    }

    let token = req.headers.authorization.replace(/['"]+/g, '');

    try {

        let payload = jwt.verify(token, secret);

        req.user = payload;

        next();
        
    } catch (error) {

        return res.status(403).json({
            message: 'No tienes autorización'
        });
        
    }

}
