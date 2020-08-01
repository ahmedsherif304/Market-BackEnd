const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const {Category} = require('../models/category');

const idSchema = new mongoose.schema({
    name:{
        type:String,
        minlength:1,
        trim:true
    }
    ,
    shopName :{
        type:String,
        minlength:1,
        trim:true
    }
})
const productSchema = new mongoose.Schema({
    id: {
        type:idSchema,
        unique:true,
        required:true
    },
    price : {
        type:Number,
        required:true,
    },
    colors: [String],
    sizes: [String],
    rate: {
        type:Number,
        default:0,
        min:0,
        max:5
    },
    numberOfRates:{
        Type:Number,
        default:0
    },
    discount:{
        Type:Number,
        min:0,
        max:100,
        default:0
    },
    category: Category    
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