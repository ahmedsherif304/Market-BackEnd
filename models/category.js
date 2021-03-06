const mongoose = require('mongoose');
const Joi = require('joi');

const categorySchema = new mongoose.Schema({
    categoryName : {
        type:String,
        minlength:1,
        maxlength:255,
        unique:true,
        trim:true,
        required:true
    }
});


const Category = mongoose.model('Category',categorySchema,'Category');

function validateCategory (category)
{
    
    const schema = {
        categoryName : Joi.string().required().min(1).max(255)
    };
    return  Joi.validate(category,schema) ;
}


exports.Category = Category;
exports.validate = validateCategory;
exports.categorySchema = categorySchema;