const express = require('express');
const router = express.Router();
const {Product} = require('../models/product');
const {Cart} = require('../models/cart');
const exceptionHandling = require('../middleware/exceptionHandling');
const auth = require('../middleware/auth');
const Joi = require('joi');
const _ = require('lodash');

router.get('/',auth,exceptionHandling( async (req,res)=>{
    const cart = await Cart.findOne({userId:userToken._id});
    res.send(cart);
}));

router.put('/:productId',auth,exceptionHandling( async (req,res)=>{
    const {error} = validateAddToCart(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let product = await Product.findById(req.params.productId);
    if (!product)   return res.status(400).send('invalid product id');
    if (product.amount < req.body.amount)   return res.status(400).send('the amount u ordered is more than avaliable');

    const cart = await Cart.findOne({userId:userToken._id});
    cart.products.push({id:req.params.productId,amount:req.body.amount});
    res.send(cart);
}));

router.delete('/:productId',auth,exceptionHandling( async (req,res)=>{
    let product = await Product.findById(req.params.productId);
    if (!product)   return res.status(400).send('invalid product id');
    const cart = await Cart.findOne({userId:userToken._id});
    _.remove(cart.products.id,{id: req.params.productId});
    await cart.save();
    res.send(cart);
}));


function validateAddToCart (product)
{
    const schema = {
        amount:Joi.number().required().min(1)
    }
    Joi.validate(product,schema);
}

module.exports = router

