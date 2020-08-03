const express = require('express');
const router = express.Router();
const {Product,validate} = require('../models/product');
const {Category} = require('../models/category');
const exceptionHandler = require('../middleware/exceptionHandling');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const _ = require('lodash');
const shopOwner = require('../middleware/shopOwner');
Fawn.init(mongoose);


router.get('/:productId',exceptionHandler(async (req,res)=>{
    const product = await Product.findById(req.params.productId);
    if (!product)   res.status(400).send('invalid product id');
    res.send(product);
}));

router.get('/',exceptionHandler(async(req,res)=>{
    const products = await Product.find().sort({discount:1});
    res.send(products);
}));

router.post('/:shopId',[auth,shopOwner],exceptionHandler(async (req,res)=>{
    const {error} = validate(req.body);
    if (error)  res.status(400).send(error.details[0].message);

    const oldProduct = await Product.find({
        id:{
            name:req.body.productName,
            shopName: req.body.shopName
        }});
    if (oldProduct) return res.status(400).send('there product is already in your shop');
    const category = await Category.findOne({name:categoryName});
    if (!category) return res.status(400).send('the category you entered is not a valid category');
    
    const product = new Product(
        {
            id:{
                name:req.body.productName,
                shopName:req.body.shopName
            },
            price: req.body.price,
            colors:req.body.colors,
            sizes:req.body.sizes,
            category:category,
            image:req.body,image,
            amount:req.body.amount,
            details:req.body.details
        }
    );
    await product.save();
    res.send(product);
    
}));

router.put('/:productId',[auth,shopOwner],exceptionHandler(async (req,res)=>{
    const {error} = validate(req.body);
    if (error)  res.status(400).send(error.details[0].message);

    let product = await Product.findById(req.params.productId);
    if (product) return res.status(400).send('invalid product id');
    const category = await Category.findOne({name:categoryName});
    if (!category) return res.status(400).send('invlalid category');

    if (product.id.shopName != req.body.shopName)   return res.status(403).send('you are not the owner of the shop that contains this product');
    product.id.name = req.body.productName;
    product.price = req.body.price;
    product.colors = req.body.colors;
    product.sizes = req.body.sizes;
    product.category = category;
    product.image = req.body.image;
    product.amount = req.body.amount;
    product.details = req.body.details;
    
    await product.save();
    res.send(product);
       
}));

router.delete(':productId',[auth,shopOwner],exceptionHandler(async (req,res)=>{
    new Fawn.Task()
        .delete('Product',{_id:req.params.productId})
        .delete('Rate',{product:{id:req.params.productId}})
        .run();

    return (true);
}));