

module.exports = function (req,res,next)
{
    const token = req.userToken;
    if (!token.isAdmin)   return res.status(403).send('access denied');     
    next();
}