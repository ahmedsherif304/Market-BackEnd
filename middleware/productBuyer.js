const {Order} = require('../models/order');
const {Product} = require('../models/product');

module.exports = async function(req,res,next)
{
    try{
        const product = await Product.findById(req.params.productId);
        if (!product)  return res.status(400).send('invalid product or user id');
        req.product = product;
        const order = await Order.find({userId:req.userToken._id,'products.id':req.params.productId});
        if (order.length == 0)   return res.status(400).send('you cannot rate this product you have to buy it first');
        next();
    }
    catch(ex)
    {
        res.status(500).send(ex.message);
    }
}