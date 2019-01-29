const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../../models/User');
const { secretOrKey } = require('../../config/key');

//@route  GET api/v1/user/
//@desc   boilerplate for the desc
//@access Public


//@route  GET api/v1/user/register
//@desc   Register User
//@access Public

router.post('/register', ( req, res ) => {

    User.findOne({ email: req.body.email })
        .then( user => {

            if ( user ) {

                return res.status( 400 ).json({ email: 'Email already exist' })

            } else {

                const avatar = gravatar.url( req.body.email, { s: '200', r: 'pg', d: 'mm' });

                const newUser = new User({

                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                    date: req.body.date

                });

                bcrypt.genSalt( 10, ( err, salt ) => {

                    bcrypt.hash( newUser.password, salt, ( err, hash ) => {

                        if ( err ) throw err;
                        newUser.password = hash;

                        newUser.save()
                            .then( user  => {

                                if ( !user ) {

                                    res.status( 400 ).json({ message: 'Bad Request' })

                                }

                                res.status( 200 ).json({ data: user })

                            })
                            .catch( e => console.log( e.message ) )

                    })

                })

            }

        })

})

//@route  GET api/v1/user/login
//@desc   Login User / Returning JWT Token
//@access Public

router.post('/login', ( req,res ) => {

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
        .then( user => {

            if ( !user ) {

                return res.status( 404 ).json({ email: 'User not found' })

            }

            bcrypt.compare( password, user.password )
                .then( isMatch => {

                    if ( isMatch ) {

                        //Create payload and  token
                        const payload = { id: user.id, name: user.name, avatar: user.avatar };
                        jwt.sign( payload, secretOrKey, { expiresIn: '3h' }, ( err,token ) => {

                            if ( err ) {

                                return res.status( 400 ).json({ message: 'Bad Reques', errors: err.message })

                            }

                            res.status( 200 ).json({

                                success: true,
                                token: `Bearer ${ token }`

                            })

                        })

                    } else {

                        return res.status( 400 ).json({ password: 'User or password invalid' })

                    }

                })
                .catch( e => console.log( e.message ) )
        })  

})

//@route  GET api/v1/user/current
//@desc   get current user
//@access Private

router.get('/current', passport.authenticate( 'jwt', { session: false } ), (req,res) => {
    
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar
    })

})

module.exports = router;