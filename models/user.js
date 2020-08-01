const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name  : {
        type:String,
        minlength:1,
        maxlength:255,
        
        //enum:['ahmed','abdo']
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
    isAdmin : {
        type:Boolean,
        default:false
    }
});

userSchema.methods.generateAuthToken = function ()
{
    return jwt.sign({_id:this._id,isAdmin:this.isAdmin},config.get('jwtPrivateKey'));
}
const User = mongoose.model('User',userSchema);

function validateUser (user)
{
    
    const schema = {
        name : Joi.string().required().min(1).max(255),
        email : Joi.string().required().email(),
        password :Joi.string().required().min(8).max(255)
    };
    return  Joi.validate(user,schema) ;
}


exports.User = User;
exports.validate = validateUser;