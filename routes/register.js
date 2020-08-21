const express = require('express');
const router = express.Router();
const {User,validate} = require('../models/user');
const {Cart} = require('../models/cart');
const {Favourite} = require('../models/favourite');
const _ = require ('lodash');
const bcrybt = require('bcrypt');
const config = require('config');
const exceptionHandling = require('../middleware/exceptionHandling');
const Fawn = require('fawn');

router.post('/',exceptionHandling( async (req,res)=>{
    const {error} =  validate(req.body);
    if (error)   return res.status(400).send(error.details[0].message);
    const oldUser = await User.findOne({email:req.body.email});
    if (oldUser)   return   res.status(400).send('this email is already registered');
    const user = new User(_.pick(req.body,['username','email','password','phone','address']));
    const salt = await bcrybt.genSalt(_.toInteger(config.get('saltLength')));   
    user.password =await bcrybt.hash(user.password,salt);
    
    
    const cart = new Cart ({
        userId:user.id
    });
    const favourite = new Favourite({
        userId:user.id
    });
    new Fawn.Task()
        .save('User',user)
        .save('Cart',cart)
        .save('Favourite',favourite)
        .run()
    const token = user.generateAuthToken();
    res.header('x-auth-token',token).send(_.pick(user,['username','email']))
}));

module.exports = router

