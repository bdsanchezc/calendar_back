const jwt = require('jsonwebtoken');

const generateJWT = ( uid, name ) => {
    const payload = { uid, name };

    try {
        const token = jwt.sign(
            payload, 
            process.env.SECRET_JWT_SEED, 
            { expiresIn: '2h' }
        );
        
        return {
            ok: true,
            token
        };
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Failed to generate token'
        };
    }
}

module.exports = { generateJWT }