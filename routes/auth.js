/* 
    * User routes 
    host + /api/auth
*/

const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const { createUser, loginUser, revalidateToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { validateToken } = require('../middlewares/validate-token');


router.post(
    '/register', 
    [ 
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Email is required').isEmail(),
        check('password', 'Password is required and must be longer than 6 characters').isLength({ min: 6 }),
        validateFields
    ], 
    createUser
);

router.post(
    '/', 
    [
        check('email', 'Email is required').isEmail(),
        check('password', 'Password is required and must be longer than 6 characters').isLength({ min: 6 }),
        validateFields
    ], 
    loginUser
);

router.get('/token', validateToken, revalidateToken);



module.exports = router;