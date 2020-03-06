'use strict';

const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const userModel = require('../models/userModel');
const passport = require('../utils/pass'); //do the login
const jwt = require('jsonwebtoken');

//log in strategies
const login = (req,res) => {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        console.log(info);
        if (err || !user) {
            console.log('login error', err, user);
            return res.status(400).json({
                message: 'Something is not right',
                user: user,
            });
        }
    req.login(user, {session: false}, (err) => {
        if (err) {
            res.send(err);
        }
          // generate a signed son web token with the contents of user object and return it in the response
        const token = jwt.sign(user, 'project2019');
        return res.json({user, token});
        });
      })
      (req, res);
};

//save username, email, phone and password under hash
const register = async (req,res,next) => {
    const errors = validationResult(req); //require validationResult

    if (!errors.isEmpty()) {
        console.log('user create error', errors);
        res.send(errors.array());
    } else {
        console.log('req?', req.body)
        const salt = bcrypt.genSaltSync(10);   //2same passwds have different hash
        const hash = bcrypt.hashSync(req.body.password,salt);
        const params = [
            req.body.username,
            req.body.email,
            req.body.phone,
            hash  //save hash instead of the actual password
        ];
        if (await userModel.addUser(params)){
            next();  //go to login step
        } else {
            res.status(400).json({error: 'register error'});
        }       
    }
};

const logout = (req, res) => {
    req.logout();
    res.json({message: 'logout'});
};

//check username and return available or not under json
const user_check = async (req, res) => {
    console.log(req.body);
    const params = [req.body.username];
    console.log('user-check', params);
    const user = await userModel.checkUser(params);
    console.log('somestring', user.length);
    if(user.length != 0){
        await res.json({available:false});
    } else {
        res.json({available: true});
    }
};


module.exports = {
    login,
    logout,
    register,
    user_check
  };