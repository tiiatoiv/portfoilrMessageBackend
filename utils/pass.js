'use strict';
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt; //allows only requests with valid tokens to access some special routes needing authentication
const userModel = require('../models/userModel');
const AnonymousStrategy = require('passport-anonymous').Strategy; //for anonymous


//anonymous for get
passport.use(new AnonymousStrategy());

//strategy for username password login
passport.use(new Strategy(
    async (username, password, done) => {
      console.log(password);
      const params = [username];
      try {
        const [user] = await userModel.getUserLogin(params);
        console.log('Local strategy', user); // result is binary row

        if (user === undefined) {
          console.log(username);
          return done(null, false, {message: 'Incorrect credential'});
        }
        console.log("password", user.password);
        if (!bcrypt.compareSync(password, user.password)) {
          console.log(username);
          return done(null, false, {message: 'Incorrect credential'});
        }
        delete user.password; // delete password from user object
        return done(null, {...user}, {message: 'Logged In Successfully'}); // a={this.props.a} b={this.props.b}
      } catch (err) {
        return done(err);
      }
    }));

//JWT strategy for handling bearer token
passport.use(new JWTStrategy({
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'project2019',
    },
    async (jwtPayload, done) => {
      console.log('payload', jwtPayload);
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      try {
        const [user] = await userModel.getUser(jwtPayload.id);
        if (user === undefined)
          return done(null, false);

        return done(null, {...user});
      } catch (err) {
        return done(err);
      }
    },
));

module.exports = passport;

/*When the user logs in, the backend creates a signed token and returns it in response
The client saves the token locally (typically in localStorage) 
and sends it back in every subsequent request that needs authentication
All requests needing authentication pass through a middleware 
that checks the provided token and allows the request only if the token is verified. */