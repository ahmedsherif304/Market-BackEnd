const mongoose = require('mongoose');
const Joi = require('joi');

const shopSchema = new mongoose.Schema({
    name: {
        type:String,
        minlength:1,
        maxlength:255,
        unique:true,
        trim:true,
        required:true
    },
    owner: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        name:String,
    },
    phone: {
        type:String,
        min:11,
        max:11,
        validate:{
            validator: function (v){
            return v.slice(0,2) == "01";
        },
        message:"the phone must starts with 01"
        }

    },
    address:{
        type:String,
        minlength:1,
        maxlength:255,
        trim:true,        
    }
});


const Shop = mongoose.model('Shop',shopSchema);

function validateShop (shop)
{
    
    const schema = {
        name : Joi.string().required().min(1).max(255),
        phone: Joi.string().length(11),
        address : Joi.string()
    };
    return  Joi.validate(shop,schema) ;
}


exports.Shop = Shop;
exports.validate = validateShop;