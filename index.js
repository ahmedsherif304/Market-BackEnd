const winston = require('winston');
const mongoose = require('mongoose');
const debug = require('debug')('app:debug');
const config = require('config');
const morgan = require('morgan');
const express = require('express');
const users = require('./routes/users');
const home = require('./routes/home');
const login = require('./routes/login');
const register = require('./routes/register');
const category  = require('./routes/categories');
const shop = require('./routes/shops')
const app = express();
app.use(express.json());
app.use('/users',users);
app.use('/',home);
app.use('/login',login);
app.use('/register',register);
app.use('/category',category);
app.use('/shop',shop);
if (!config.get('jwtPrivateKey'))
{
    console.error('FATAL ERROR JWT PRIVATE KEY IS NOT SET');
    process.exit(1);
}


mongoose.connect(`${config.get('dbString')}/market`)
    .then(()=>console.log('connected to database..'))
    .catch(()=>console.error('failed to connect to database..'));


if (app.get('env') === 'development')      app.use(morgan('tiny'));
const port = process.env.port || 3000;
app.listen(port,()=> console.log(`listening on port ${port}...`));
