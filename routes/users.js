const express = require('express');
const router = express.Router();
const {User,validate} = require('../models/user');
const mongoose = require('mongoose');
const exceptionHandling = require('../middleware/exceptionHandling');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const _ = require ('lodash');
const config = require('config');
const Joi = require('joi');


router.get('/:id',auth,exceptionHandling( async (req,res)=>{
    let user = await User.find({_id:req.params.id},{_id:0,__v:0,isAdmin:0});
    res.send(user);
}));

router.put('/username/:id',auth,exceptionHandling( async (req,res)=>{
    const {error} =  validateUsername(req.body);
    if (error)  return    res.status(400).send(error.details[0].message);

    await User.updateOne({_id:req.params.id},{name:req.body.username});
    
    res.send(true); 
}));

router.put('/password/:id',auth,exceptionHandling( async (req,res)=>{
    const {error} =  validateUpdatePassword(req.body);
    if (error)  return    res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({_id:req.params.id});
    const validPassword = await bcrypt.compare(req.body.oldPassword,user.password);
    if (!validPassword) return   res.status(400).send('The old password is incorrect');

    if (req.body.newPassword != req.body.confirmNewPassword ) return res.status(400).send('new password and confirm new password must match');

    const salt = await bcrypt.genSalt(_.toInteger(config.get('saltLength'))); 
    user.password = await bcrypt.hash(req.body.newPassword,salt);

    await user.save();
    res.send(true); 
}));

function validateUsername(user)
{
    const schema={
        username:Joi.string().required().min(1).max(255)
    };
    return  Joi.validate(user,schema) ;
}


function validateUpdatePassword(user)
{
    const schema={
        oldPassword: Joi.string().required().min(8).max(255),
        newPassword: Joi.string().required().min(8).max(255),
        confirmNewPassword: Joi.string().required().min(8).max(255)
    };
    return  Joi.validate(user,schema) ;
}
module.exports = router