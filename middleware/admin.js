

module.exports = function (req,res,next)
{
    const token = req.userToken;
    if (token.type != 'Admin')   return res.status(403).send('access denied');     
    next();
}