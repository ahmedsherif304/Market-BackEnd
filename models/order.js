const mongoose = require('mongoose');
const Joi  = require('joi');

const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    products:[{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        amount:Number,
        name:String
    }],
    totalPrice:{
        type:Number,
        required:true,
        min:0
    },
    state:{
        type:String,
        enum:['preparing','shipping','delivering','delivered'],
        default:'preparing'
    },
    destination : {
        type:String,
        required:true
    },
    dateOfOrder : {
        type:Date,
        default:Date.now()
    },
    phone:{
        type:String,
        required:true
    }
});

function validateOrder (order)
{
    const schema ={
        amounts : Joi.array().items(Joi.number().min(1)).required(),
        destination:Joi.string().required(),
        phone:Joi.string().required()
    }
    return Joi.validate(order,schema);
}


const Order = mongoose.model('Order',orderSchema,'Order');

exports.Order = Order;
exports.validate = validateOrder;