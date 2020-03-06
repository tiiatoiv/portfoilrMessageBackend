'use strict';
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {body, sanitizeBody} = require('express-validator');


router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/register',
    [
        body('username', 'Minimum 3 characters').isLength({min: 3}).exists(),
        body('email', 'Email is not valid').isEmail().not().isEmpty().normalizeEmail(),
        body('password', 'Minimum 5 characters').not().isEmpty().isLength({min: 5}),
        body('password-retype', 'Passwords not match').custom((value, {req}) => (value === req.body.password)),
        sanitizeBody('name').escape(),
    ],
    authController.register,
    authController.login,
);

router.post('/checkuser', authController.user_check);

module.exports = router;