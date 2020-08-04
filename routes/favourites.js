const express = require('express');
const router = express.Router();
const {Product} = require('../models/product');
const {Favourite} = require('../models/favourite');
const exceptionHandling = require('../middleware/exceptionHandling');
const auth = require('../middleware/auth');
const Joi = require('joi');
const _ = require('lodash');


router.get('/',auth,exceptionHandling( async (req,res)=>{
    const favourite = await Favourite.findOne({userId:userToken._id});
    res.send(favourite);
}));

router.put('/:productId',auth,exceptionHandling( async (req,res)=>{
    let product = await Product.findById(req.params.productId);
    if (!product)   return res.status(400).send('invalid product id');

    const favourite = await Favourite.findOne({userId:userToken._id});
    favourite.products.push({id:req.params.productId,amount:req.body.amount});
    res.send(favourite);
}));

router.delete('/:productId',auth,exceptionHandling( async (req,res)=>{
    let product = await Product.findById(req.params.productId);
    if (!product)   return res.status(400).send('invalid product id');
    const favourite = await Favourite.findOne({userId:userToken._id});
    _.remove(favourite.products.id,{id: req.params.productId});
    res.send(favourite);
}));



module.exports = router

