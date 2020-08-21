const express = require('express');
const router = express.Router();
const {Cart} = require('../models/cart');
const {Product} = require('../models/product');
const {Order,validate} = require('../models/order');
const exceptionHandling = require('../middleware/exceptionHandling');
const auth = require('../middleware/auth');
const employee = require('../middleware/employee');
const  Joi  = require('joi');
const Fawn = require('fawn');


router.get('/',auth,exceptionHandling( async (req,res)=>{
    const orders = await Order.find({userId:req.userToken._id});
    res.send(orders);
}));

router.get('/:id',auth,exceptionHandling( async (req,res)=>{
    const order = await Order.findOne({_id:req.params.id,userId:req.userToken._id});
    if (!order) return res.status(400).send('invalid order id');
    res.send(order);
}));


router.post('/',auth,exceptionHandling( async (req,res)=>{
    const {error} = validate(req.body);
    if (error)  res.status(400).send(error.details[0].message);
    let cart = await Cart.findOne({userId:req.userToken._id});
    if (cart.products.length == 0)    return res.status(400).send('your cart is empty please fill it with some products to make and order');
    let amount = req.body.amounts
    if (amount.length != cart.products.length )    return res.status(400).send('the amount array size does not match the products size');
    let totalMoney = 0,index=0; 
    let Products = [];
    //const task = new Fawn.Task();
    for(const product of cart.products)  {
        const originalProduct = await Product.findById(product.id);
        if (originalProduct.amount < amount[index])    return res.status(400).send('the amount of the product is more that exists in the store');
        totalMoney += (originalProduct.price - (originalProduct.price * originalProduct.discount/100))*amount[index]; 
        originalProduct.amount -= amount[index];
        //task.save('Product',originalProduct);
        await originalProduct.save();
        Products.push({id:product.id,amount:amount[index],name:product.productName});
        index+=1;
    };
    const order = new Order({
        userId: req.userToken._id,
        products: Products,
        totalPrice:totalMoney,
        destination: req.body.destination,
        phone:req.body.phone
    });
    cart.products = [];
    await cart.save();
    await order.save();
    // task.save('Cart',cart)
    //     .save('Order',order)
    //     .run();
    res.send(order);
}));

router.delete('/:id',auth,exceptionHandling( async (req,res)=>{
    const order = await Order.findOne({_id:req.params.id,userId:req.userToken._id});
    if (!order)     return res.status(400).send('invalid order id')
    if (order.state == 'delivering' || order.state == 'delivered')  return res.status(400).send('u cannot delete an order that being delivered')
    for (const product of order.products)   await Product.findByIdAndUpdate(product.id,{$inc:{amount:product.amount}});
    await order.deleteOne();
    res.send(true);
}));

router.put('/state/:id',[auth,employee],exceptionHandling( async (req,res)=>{
    const {error} = validateState(req.body);
    if (error)  return res.status(400).send(error.details[0].message);
    const states = ['shipping','delivering','delivered']
    const state = states[req.body.state-1];
    const order = await Order.findByIdAndUpdate(req.params.id,{state:state});
    res.send(order);
}));

function validateState(order)
{
    const schema={
        state:Joi.number().required().min(1).max(3).integer()
    };
    return Joi.validate(order,schema);
}

module.exports = router

