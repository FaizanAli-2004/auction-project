const users = require('../models/user.server.models');

// Auth middleware to check if a user is logged in(using token)
const isAuthenticated = function(req,res,next){
    let token = req.headers['x-authorization'];
    if (!token) return res.sendStatus(401);
    users.getUserIdFromToken(token, (err,id)=> {
        if(err || id == null) return res.sendStatus(401);
         
        next(); 
    })
};


module.exports = {
    isAuthenticated: isAuthenticated
};



