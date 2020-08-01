

module.exports = function (handler)
{
    return async (req,res,next) => {  
        {
            try{
                await handler(req,res);
            }
            catch(err)
            {
                res.status(500).send(err.message);
            }
            
        }

    }   
}