const {Shop,validate} = require('../models/shop')


module.exports = async function (req,res,next)
{
    try{
        const {error} = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        const token = req.userToken;
        const shop = await Shop.findOne({name:req.body.shopName});
        if (!shop)  return res.status(400).send('the shop name is invalid')
        if (shop.owner.id != token._id)     return res.status(403).send('you are not the owner of this shop');   
        next();
    }
    catch(ex)
    {
        res.status(500).send(ex.message)
    }
    
}