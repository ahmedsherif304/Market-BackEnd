const express = require('express');
const router = express.Router();
const {Product} = require('../models/product');
const {Favourite} = require('../models/favourit');
const exceptionHandling = require('../middleware/exceptionHandling');
const auth = require('../middleware/auth');
const Joi = require('joi');
const _ = require('lodash');


router.get('/',auth,exceptionHandling( async (req,res)=>{
    const favourit = await Favourite.findOne({userId:userToken._id});
    res.send(favourit);
}));

router.put('/:productId',auth,exceptionHandling( async (req,res)=>{
    if (error) return res.status(400).send(error.details[0].message);
    let product = await Product.findById(req.params.productId);
    if (!product)   return res.status(400).send('invalid product id');

    const favourit = await Favourite.findOne({userId:userToken._id});
    favourit.products.push({id:req.params.productId,amount:req.body.amount});
    res.send(favourit);
}));

router.delete('/:productId',auth,exceptionHandling( async (req,res)=>{
    let product = await Product.findById(req.params.productId);
    if (!product)   return res.status(400).send('invalid product id');
    const favourit = await Favourite.findOne({userId:userToken._id});
    _.remove(favourit.products.id,{id: req.params.productId});
    res.send(favourit);
}));



module.exports = router

