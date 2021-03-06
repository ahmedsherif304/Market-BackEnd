const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username  : {
        type:String,
        minlength:1,
        maxlength:255,
        trim:true,
        required:true
    },
    email : {
        type:  String,
        unique:true,
        required:true,
    },
    password : {
        type:  String,
        required:true,
        min:8,
        max:2048,
        trim:true        
    },
    type : {
        type:String,
        enum:['Admin','Employee','Customer'],
        default:'Customer'
    },
    phone :String,
    address :String
});

userSchema.methods.generateAuthToken = function ()
{
    return jwt.sign({_id:this._id,type:this.type},config.get('jwtPrivateKey'));
}
const User = mongoose.model('User',userSchema,'User');

function validateUser (user)
{
    
    const schema = {
        username : Joi.string().required().min(1).max(255),
        email : Joi.string().required().email(),
        password :Joi.string().required().min(8).max(255),
        phone:Joi.string(),
        address:Joi.string()
    };
    return  Joi.validate(user,schema) ;
}


exports.User = User;
exports.validate = validateUser;