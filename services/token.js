const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

const createToken = (user) => {

    const payload = {
        id: user._id,
        username: user.username,
        iat: Date.now(),
        exp: Date.now() + 1000 * 60 * 60 * 24
    };

    return jwt.sign(payload, secret);

}

module.exports = createToken;
