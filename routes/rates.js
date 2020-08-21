const express = require('express');
const router = express.Router();
const {Rate,validateRate} = require('../models/rate');
const {User} = require('../models/user');
const {Product} = require('../models/product');
const exceptionHandler = require('../middleware/exceptionHandling');
const productBuyer = require('../middleware/productBuyer');
const auth = require('../middleware/auth');
const _ = require('lodash');


router.get('/:id',exceptionHandler(async (req,res)=>{
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send('invalid product id');
    const rates = await Rate.find({productId:product._id});
    rates.reverse();
    res.send(rates);
}));

router.post('/:productId',[auth,productBuyer],exceptionHandler(async (req,res)=>{
    const {error} = validateRate(req.body);
    if (error)  res.status(400).send(error.details[0].message);
    
    const oldRates = await Rate.find({productId:req.params.productId});
    if (_.findIndex(oldRates,(rate)=>{return rate.userId == req.userToken._id}) != -1)   return res.status(400).send('you cannot rate the same product twice');
    const newRate = new Rate({
        productId:req.params.productId,
        comment:req.body.comment,
        rate:req.body.rate,
        userId:req.userToken._id
    });
    // new Fawn.Task()
    //     .save('Rate',newRate)
    //     .update('product',{_id:product.id},{rate:(req.body.rate + product.rate * rate.size())/(rate.size()+1)})
    //     .run();
    await newRate.save();
    await  Product.findByIdAndUpdate(req.params.productId,{rate:(req.body.rate + req.product.rate * oldRates.length)/(oldRates.length+1)});

    res.send(_.pick(req.body,['rate','comment']));
    
}));


router.put('/:productId',[auth,productBuyer],exceptionHandler(async (req,res)=>{
    const {error} = validateRate(req.body);
    if (error)  res.status(400).send(error.details[0].message);
    
    const oldTotalRate = req.product.rate;
    const numberOfRates = (await Rate.find({productId:req.params.productId})).length;
    const oldRate = await Rate.findOne({productId:req.params.productId,userId:req.userToken._id});
    if (!oldRate)   return res.status(400).send('you have not rated this product yet');
    const newRate = ((oldTotalRate*numberOfRates - oldRate.rate)*(numberOfRates-1)+req.body.rate)/numberOfRates;
    oldRate.rate = req.body.rate;
    oldRate.comment = req.body.comment; 
    await oldRate.save()
    await  Product.findByIdAndUpdate(req.params.productId,{rate:newRate});

    res.send(_.pick(req.body,['rate','comment']));    
}));

module.exports = router