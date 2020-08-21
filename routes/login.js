const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const exceptionHandling = require('../middleware/exceptionHandling');


router.post('/',exceptionHandling ( async (req,res)=>{
    const {error} =  validate(req.body);
    if (error)   return res.status(400).send(error.details[0].message);
    const  user = await User.findOne({email:req.body.email});
    console.log(user);
    if (!user)   return   res.status(400).send('The password or the email is incorrect');
    
    console.log(user);
    const validPassword = await bcrypt.compare(req.body.password,user.password);
    if (!validPassword) return   res.status(400).send('The password or the email is incorrect');
    const token = user.generateAuthToken();
    res.send(token);
}));

function validate(user)
{
    const schema = {
        email : Joi.string().required().email(),
        password :Joi.string().required().min(8).max(255)
    };
    return Joi.validate(user,schema);
}

module.exports = router