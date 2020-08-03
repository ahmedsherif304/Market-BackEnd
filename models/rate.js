const mongoose = require('mongoose');
const rateSchema = new mongoose.Schema({
    product:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        },
        name:String
    },
    comment:String,
    rate:{
        type:Numbernew,
        min:0,
        max:5
    },
    user: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        name:String,
    }
});


const Rate = mongoose.model('Rate',rateSchema);

function validateRate (rate)
{
    
    const schema = {
        comment : Joi.string().required().min(1),
        rate : Joi.Number().required().min(0).max(5)
    };
    return  Joi.validate(rate,schema) ;
}


exports.Rate = Rate;
exports.validateRate = validateRate;