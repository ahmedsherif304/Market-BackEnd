const express = require('express');
const router = express.Router();
const {Category,validate} = require('../models/category');
const exceptionHandling = require('../middleware/exceptionHandling');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require ('lodash');
const Joi = require('joi');


router.get('/',[auth,admin],exceptionHandling( async (req,res)=>{
  const categories  = await Category.find().sort('name');
  res.send(categories);
}));

router.post('/',[auth,admin],exceptionHandling( async (req,res)=>{
     const {error} = validate(req.body);
     if (error) return res.status(400).send(error.details[0].message);
     const category = new Category(_.pick(req.body,['name']));
     await category.save();
     res.send(category);
}));

router.delete('/',[auth,admin],exceptionHandling( async (req,res)=>{
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    await Category.deleteOne({name:req.body.name});
    res.send(true);
}));

router.put('/',[auth,admin],exceptionHandling( async (req,res)=>{
    const {error} = validateUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const category = await Category.findOne({name:req.body.oldName});
    if (!category)  return res.status(400).send('please inter valid category name');
    category.name = req.body.newName;
    await category.save();
    res.send(category);
}));

function validateUpdate(category)
{
    const schema = {
        oldName : Joi.string().required().min(1).max(255),
        newName : Joi.string().required().min(1).max(255)
    };
    return  Joi.validate(category,schema) ;
}

module.exports = router