const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
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
        amount:Number
    }]
});


const Cart = mongoose.model('Cart',cartSchema);

exports.Cart = Cart;