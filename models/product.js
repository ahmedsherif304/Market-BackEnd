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
    },
    shopName :String
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
    discount:{
        Type:Number,
        min:0,
        max:100,
        default:0
    },
    category:{
        type:Category,
        required:true
    },
    image:String,
    details:String,
    amount:{
        type:Number,
        required:true,
        min:0
    }
});


const Product = mongoose.model('Product',productSchema);

function validateProduct (product)
{
    
    const schema = {
        productName : Joi.string().required().min(1).max(255),
        price : Joi.number().required().min(0),
        colors :Joi.array(),
        sizes:Joi.array(),
        discount:Joi.number().min(0).max(100),
        image:Joi.string().required(),
        shopName:Joi.string().required(),
        categoryName:Joi.string().required(),
        amount:Joi.number().min(1),
        details:Joi.String().require()
    };
    return  Joi.validate(product,schema) ;
}


exports.Product = Product;
exports.validate = validateProduct;