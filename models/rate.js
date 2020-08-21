const mongoose = require('mongoose');
const Joi = require('joi');
const rateSchema = new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    comment:String,
    rate:{
        type:Number,
        min:0,
        max:5
    },
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
    
});


const Rate = mongoose.model('Rate',rateSchema,'Rate');

function validateRate (rate)
{
    
    const schema = {
        comment : Joi.string().required().min(1),
        rate : Joi.number().required().min(0).max(5)
    };
    return  Joi.validate(rate,schema) ;
}


exports.Rate = Rate;
exports.validateRate = validateRate;