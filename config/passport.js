const { Strategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');
const { secretOrKey } = require('./key');


const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretOrKey;

module.exports = passport  => {

    passport.use( new Strategy( opts, ( jwt_payload, done ) => {

        User.findById( jwt_payload.id )
            .then( user => {

                if ( user ) {

                    return done( null, user )
                }

                return done( null, false )

            })
            .catch( e => console.log( e ) )

    }))

}