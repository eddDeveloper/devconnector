'use strict'

const express = require('express');
const mongoose = require('mongoose');
const { URLDB } = require('./config/key');

const app = express();
const PORT = process.env.PORT || 5000;

// Routes import
const user = require('./routes/api/user');
const profile = require('./routes/api/profile');
const post = require('./routes/api/post');

// connect to DB
mongoose.connect( URLDB, { useNewUrlParser : true } )
    .then( () => console.log('Data Base Connected!') )
    .catch( e => console.log( e.message ) )


// Router config
app.use('/api/v1/user', user);
app.use('/api/v1/profile',profile);
app.use('/api/v1/post',post);

app.listen( PORT , () => console.log(`Server running on port ${PORT}`))