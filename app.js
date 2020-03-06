'use strict';
require('dotenv').config();

const express = require('express');
const app = express(); 
const cors = require('cors');
const port = 5500;
const passport = require('./utils/pass');
const authRoute = require('./routes/authRoute');
const messageRoute = require('./routes/messageRoute');

app.use(cors());
app.use(express.json());   //for parsing application/json
app.use(express.urlencoded({extended: true}));  //for parsing application/x-www-form-urlencoded
app.use(express.static('uploads'));
app.use(express.static('html'));
app.use(express.static('css'));
app.use(express.static('js'));

app.use('/thumbnails', express.static('thumbnails'));


/*if(process.env.SERVER === 'dev_localhost') {
    require('./secure/localhost')(app);
} else {
    require('./secure/server')(app);
    app.listen(5500, () => {
        console.log('server app start?')
    });
}*/
app.use('/auth', authRoute);
app.use('/message', messageRoute);

app.listen(port, () => console.log(`App listens on port ${port}!`));

