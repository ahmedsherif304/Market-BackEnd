
module.exports = function (req,res,next)
{
    const token = req.userToken;
    if (token.type != 'Employee')   return res.status(403).send('access denied');     
    next();
}