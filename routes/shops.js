const express = require('express');
const router = express.Router();
const {Shop,validate} = require('../models/shop');
const {User} = require('../models/user');
const {Product} = require('../models/product');
const {Rate} = require('../models/rate');
const exceptionHandling = require('../middleware/exceptionHandling');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require ('lodash');
const shopOwner = require('../middleware/shopOwner');
const Fawn = require('fawn');


router.get('/',[auth,admin],exceptionHandling( async (req,res)=>{
  const shops  = await Shop.find({},{__v:0}).sort('name');
  res.send(shops);
}));

router.get('/',auth,exceptionHandling(async (req,res)=>{
    const shops = await Shop.find({
        owner:{
            id:req.params.userToken._id
        }});
    res.send(shops);
}));


router.get('/:id',auth,exceptionHandling( async (req,res)=>{
    const shop  = await Shop.findById(req.params.id);
    if (!shop)  return res.status(400).send('invalid shop id');
    res.send(shop);
}));

router.get('/:id/products',exceptionHandling(async (req,res)=>{
    const shop  = await Shop.findById(req.params.id);
    if (!shop)  return res.status(400).send('the shop id is invalid');
    console.log(shop.shopName);
    const products = await Product.find({
        'id.shopName':  shop.shopName
    });
    res.send(products);
}));

router.post('/',auth,exceptionHandling( async (req,res)=>{
    const token = req.userToken;
     const {error} = validate(req.body);
     if (error) return res.status(400).send(error.details[0].message);
     const owner = await User.findById(token._id); 
     const shop = new Shop(_.pick(req.body,['shopName','phone','address']));
     shop.owner = {
         id: token._id,
         name : owner.username
     }
     await shop.save();
     res.send(shop);
}));

router.delete('/:shopId',[auth,shopOwner],exceptionHandling( async (req,res)=>{
    const shop = req.body.shop;
    const products = await Product.find({id:{shopName:shop.shopName}});
    const task = Fawn.Task();
    for (const product of products)
    {
        const rate = await Rate.find({product:{id:product.id}});
        task.remove('Rate',rate);
    }
    task.remove('Shop',shop)
    task.remove('Product',products)
    task.run();
    res.send(true);
}));


router.put('/:shopId',[auth,shopOwner],exceptionHandling( async (req,res)=>{
    const shop = req.body.shop;
    shop.phone = req.body.phone;
    shop.address = req.body.address;
    await shop.save();
    res.send(shop);
}));


module.exports = router