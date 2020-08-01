const express = require('express');
const router = express.Router();
const {Shop,validate} = require('../models/shop');
const {User} = require('../models/user');
const exceptionHandling = require('../middleware/exceptionHandling');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require ('lodash');
const Joi = require('joi');
const shopOwner = require('../middleware/shopOwner');



router.get('/',[auth,admin],exceptionHandling( async (req,res)=>{
  const shops  = await Shop.find({},{_id:0,__v:0}).sort('name');
  res.send(shops);
}));

router.get('/:id',auth,exceptionHandling( async (req,res)=>{
    const shop  = await Shop.find({name:req.body.name});
    res.send(shop);
}));

router.post('/',auth,exceptionHandling( async (req,res)=>{
    const token = req.userToken;
     const {error} = validate(req.body);
     if (error) return res.status(400).send(error.details[0].message);
     const owner = await User.findById(token._id); 
     const shop = new Shop(_.pick(req.body,['name','phone','address']));
     shop.owner = {
         id: token._id,
         name : owner.name
     }
     await shop.save();
     res.send(shop);
}));

router.delete('/:id',[auth,shopOwner],exceptionHandling( async (req,res)=>{
    await Shop.deleteOne({name:req.body.name});
    res.send(true);
}));

router.put('/:id',[auth,shopOwner],exceptionHandling( async (req,res)=>{
    let shop = await Shop.findOne({name:req.body.name});
    shop.phone = req.body.phone;
    shop.address = req.body.address;
    await shop.save();
    res.send(shop);
}));


module.exports = router