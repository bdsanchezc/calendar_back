const { response: res } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (request, response = res) => {

    const { email, password } = request.body;

    try {
        let user = await User.findOne({ email });
        
        if(user) {
            return response.status(400).json({
                ok: false,
                message: 'There is already a user associated with that email',
            })
        }

        user = new User(request.body);

        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        const token = generateJWT(user.id, user.name);
        
        response.status(201).json({
            ok: true,
            message: 'User created successfully',
            uid: user.id,
            name: user.name,
            token
        })
    } catch (error) {
        console.log(error);
        response.status(500).json({
            ok: false,
            message: 'Please contact the administrator of the application',
        })
    }

}

const loginUser = async (request, response = res) => {

    const { email, password } = request.body;

    try {
        let user = await User.findOne({ email });
        
        if(!user) {
            return response.status(400).json({
                ok: false,
                message: `The user with email ${email} does not exist in the database`,
            })
        }

        const validatePassword = bcrypt.compareSync(password, user.password);

        if(!validatePassword) {
            return response.status(400).json({
                ok: false,
                message: `The password is not correct`,
            })
        }

        const token = generateJWT(user.id, user.name); 

        response.json({
            ok: true,
            message: 'User logged in successfully',
            uid: user.id,
            name: user.name,
            token
        })
    } catch (error) {
        console.log(error);
        response.status(500).json({
            ok: false,
            message: 'Please contact the administrator of the application',
        })
    }
}

const revalidateToken = (request, response = res) => {

    const { uid, name } = request;
    const token = generateJWT(uid, name); 

    response.json({
        ok: true,
        message: 'New token created.',
        uid,
        name,
        token
    })
}

module.exports = { createUser, loginUser, revalidateToken }
