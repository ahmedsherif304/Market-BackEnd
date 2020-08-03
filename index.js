const winston = require('winston');
require('winston-mongodb');
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
const shop = require('./routes/shops');
const rate = require('./routes/rates')
const product = require('./routes/products')
const app = express();

app.use(express.json());
app.use('/users',users);
app.use('/',home);
app.use('/login',login);
app.use('/register',register);
app.use('/category',category);
app.use('/shop',shop);
app.use('/rate',rate);
app.use('/product',product);


process.on('unhandledRejection',(ex)=>{
    winston.error(ex.message,ex);
    process.exit(1);
})
process.on('uncaughtException',(ex)=>{
    winston.error(ex.message,ex);
    process.exit(1);
})

winston.add(winston.transports.File,{filename: 'logfile.log'});
winston.add(winston.transports.MongoDB,{db:`${config.get('dbString')}`,level:'error'});



if (!config.get('jwtPrivateKey'))
{
    console.error('FATAL ERROR JWT PRIVATE KEY IS NOT SET');
    process.exit(1);
}

mongoose.connect(`${config.get('dbString')}`)
    .then(()=>console.log('connected to database..'))
    .catch(()=>console.error('failed to connect to database..'));




if (app.get('env') === 'development')      app.use(morgan('tiny'));
const port = process.env.port || 3000;
app.listen(port,()=> console.log(`listening on port ${port}...`));



