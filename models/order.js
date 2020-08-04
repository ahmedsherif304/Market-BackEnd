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
        required:true
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
    }
});


const Order = mongoose.model('Order',orderSchema);

exports.Order = Order;