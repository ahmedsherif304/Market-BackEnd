const {Shop} = require('../models/shop')


module.exports = async function (req,res,next)
{
    try{
        const token = req.userToken;
        const shop = await Shop.findById(req.params.shopId);
        if (!shop)  return res.status(400).send('the shop name is invalid')
        if (shop.owner.id != token._id)     return res.status(403).send('you are not the owner of this shop');   
        req.shop = shop;
        next();
    }
    catch(ex)
    {
        res.status(500).send(ex.message)
    }
    
}