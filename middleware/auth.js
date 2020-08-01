const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = function (req,res,next)
{
    const token = req.header('x-auth-token');
    if (!token)   return res.status(401).send('please log in first');     
    
    try{
        const user =  jwt.verify(token,config.get('jwtPrivateKey'));
        req.userToken = user;
        next();
    }
    catch(ex)
    {
        res.status(400).send('invalid token');
    }   
}