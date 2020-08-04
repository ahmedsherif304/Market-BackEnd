const {Order} = require('../models/order');
const {validate} = require('../models/rate');

module.exports = async function(req,res,next)
{
    try{
        const order = await Order.find({userId:req.body.userToken._id,products:{id:req.params.productId}});
        if (!order)   return res.status(400).send('you cannot rate this product you have to buy it first');
        next();
    }
    catch{ex}
    {
        res.status(500).send(ex.message);
    }
}