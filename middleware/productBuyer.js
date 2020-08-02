

module.exports = async function(req,res,next)
{
    try{
        
        next();
    }
    catch{ex}
    {
        res.status(500).send(ex.message);
    }
}