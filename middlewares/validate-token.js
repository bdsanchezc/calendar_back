const { response : res } = require('express');
const jwt = require('jsonwebtoken');

const validateToken = (request, response = res, next) => {

    const token = request.header('x-token');
    
    if(!token) {
        return response.status(401).json({
            ok: false,
            message: 'User not authenticated.'
        })
    }

    try {
        const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);
        
        request.uid = uid;
        request.name = name;

    } catch (error) {
        console.log(error);
        return response.status(401).json({
            ok: false,
            message: 'This token is not valid.'
        })
    }


    next();
}

module.exports = { validateToken }