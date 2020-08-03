const express = require('express');
const router = express.Router();
const {Rate,validateRate} = require('../models/rate');
const {User} = require('../models/user');
const {Product} = require('../models/product');
const exceptionHandler = require('../middleware/exceptionHandling');
const productBuyer = require('../middleware/productBuyer');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const _ = require('lodash');
Fawn.init(mongoose);

router.get('/:id',exceptionHandler(async (req,res)=>{
    const product = await Product.findById(id);
    if (!product) return res.status(400).send('invalid product id');
    const rates = await Rate.find({product:{id:req.params.id}});
    rates.reverse();
    res.send(rates);
}));

router.post('/:productId',[auth,productBuyer],exceptionHandler(async (req,res)=>{
    const {error} = validateRate(req.body);
    if (error)  res.status(400).send(error.details[0].message);
    const product = await Product.findById(req.params.productId);
    const user = await User.findById(req.params.userToken._id);
    if (!user || !product)  return res.status(400).send('invalid product or user id');

    const rate = await Rate.find({product:{id:req.params.productId}});
    const users = rate.user;
    if (users.indexOf(req.params.userToken._id)!=-1)   return res.send(400).send('you cannot rate the same product twice');
    else 
    {
        const user = await User.findById(req.params.userToken._id);
        const product = await Product.findById(req.params.productId); 
        const newRate = new Rate({
            product:{
                id: product._id,
                name : product.name
            },
            comment:req.body.comment,
            rate:req.body.rate,
            user:{
                id:user._id,
                name:user.name
            }
        });
        new Fawn.Task()
            .save('Rate',newRate)
            .update('product',{_id:product.id},{rate:(req.body.rate + product.rate * rate.size())/(rate.size()+1)})
            .run();
        res.send(newRate);
    }
    
}));


router.put('/:productId',[auth,productBuyer],exceptionHandler(async (req,res)=>{
    const {error} = validateRate(req.body);
    if (error)  res.status(400).send(error.details[0].message);
    const product = await Product.findById(req.params.productId);
    const user = await User.findById(req.userToken._id);
    if (!user || !product)  return res.status(400).send('invalid product or user id');

    const oldTotalRate = product.rate;
    const numberOfRates = await Rate.find({
        product:{
            id:req.params.productId
        }
    }).size();
    const oldRate = await Rate.find({
        product:{
            id:req.params.productId
       },
       user:{
           id:req.params.userToken._id
       }
    })
    const newRate = ((oldTotalRate*numberOfRates - oldRate)*(numberOfRates-1)+req.body.rate)/numberOfRates;
    new Fawn.Task()
        .update('Rate',{
            product:{
                id:req.params.productId
            },
            user:{
                id:req.params.userToken._id
            }
        },{
            comment:req.body.comment,
            rate:req.body.rate
        })
        .update('Product',{_id:req.params.productId},{rate:newRate})
        .run();

    res.send(_.pick(req.body,['rate','comment']));    
}));