const express = require('express');
const router = express.Router();
const {User,validate} = require('../models/user');
const {Cart} = require('../models/cart');
const {Favourite} = require('../models/favourite');
const _ = require ('lodash');
const bcrybt = require('bcrypt');
const config = require('config');
const exceptionHandling = require('../middleware/exceptionHandling');
const mongoose = require('mongoose');
const Fawn = require('fawn');
Fawn.init(mongoose);

router.post('/',exceptionHandling( async (req,res)=>{
    const {error} =  validate(req.body);
    if (error)   return res.status(400).send(error.details[0].message);
    let user = await User.findOne({email:req.body.email});
    if (user)   return   res.status(400).send('this email is already registered');
    user = new User(_.pick(req.body,['username','email','password']));
    const salt = await bcrybt.genSalt(_.toInteger(config.get('saltLength')));   
    user.password =await bcrybt.hash(user.password,salt);
    let task = Fawn.Task();
    task.save('User',user);
    const cart = new Cart ({
        userId:user.id
    });
    const favourite = new Favourite({
        userId:user.id
    });
    task.save('Cart',cart);
    task.save('Favourite',favourite);
    task.run();
    const token = user.generateAuthToken();
    res.header('x-auth-token',token).send(_.pick(user,['username','email']))
}));

module.exports = router

