const express = require('express');
const router = express.Router();
const {Cart} = require('../models/cart');
const {Order} = require('../models/order');
const exceptionHandling = require('../middleware/exceptionHandling');
const auth = require('../middleware/auth');
const employee = require('../middleware/employee');
const Fawn = require('fawn');
const mongoose = require('mongoose');
const  Joi  = require('joi');
Fawn.init(mongoose);


router.get('/',auth,exceptionHandling( async (req,res)=>{
    const orders = await Order.find({userId:userToken._id});
    res.send(orders);
}));

router.get('/:id',auth,exceptionHandling( async (req,res)=>{
    const order = await Order.findOne({_id:req.params.id,userId:userToken._id});
    if (!order) return res.status(400).send('invalid order id');
    res.send(order);
}));


router.post('/',auth,exceptionHandling( async (req,res)=>{
    let cart = await Cart.findOne({userId:req.userToken._id});
    if (cart.products.isEmpty())    return res.status(400).send('your cart is empty please fill it with some products');
    let totalMoney = 0;
    cart.products.forEach(product => {
        totalMoney += product.price - (product.price * product.discount/100); 
    });
    const order = new Order({
        userId: req.userToken._id,
        products: cart.products,
        totalPrice:totalMoney
    });
    cart.products = [];
    new Fawn.Task()
        .save('Cart',cart)
        .save('Order',order);
    res.send(order);
}));

router.delete('/:id',auth,exceptionHandling( async (req,res)=>{
    const order = await Order.deleteOne({_id:req.params.id,userId:req.userToken._id});
    res.send(true);
}));

router.put('/state/:id',[auth,employee],exceptionHandling( async (req,res)=>{
    const {error} = validateState(req.body);
    if (error)  return res.status(400).send(error.details[0].message);
    const order = await Order.findByIdAndUpdate(req.params.id,{status:req.body.state});
    res.send(order);
}));

function validateState(order)
{
    const schema={
        state:Joi.string().required().tags(['shipping','delivering','delivered'])
    };
    return joi.validate(order,schema);
}

module.exports = router

