const joi = require("joi");
const users = require('../models/user.server.models');
const { containsProfanity } = require('../utils/profanityFilter');

// Creates a new user account after validating input and enforcing password rules.
// Returns the new user_id if successful.
const create_account = (req, res) => {
    const schema= joi.object({
        first_name: joi.string().trim().min(1).required(),
        last_name: joi.string().trim().min(1).required(),
        email: joi.string().trim().email().required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Please enter a valid email address"
        }),

        password: joi.string()
        .min(8)
        .max(30)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).+$'))
        .required()
        .messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 8 characters long",
            "string.pattern.base": 
                "Password must include: 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&)"
        })
       }).unknown(false);

       if (containsProfanity(req.body.first_name && req.body.last_name)) {
            return res.status(400).json({ error_message: "Name contains inappropriate language" });
        }
    
       const{error} = schema.validate(req.body);
       if(error) return res.status(400).send({error_message: error.details[0].message});

       let user = Object.assign({}, req.body);

       users.addNewUser(user, (err,user_id)=> {
        
        if (err) {
               if (err.code === 'SQLITE_CONSTRAINT') {
               return res.status(400).send({error_message: 'Email already exists' });
               }
        return res.sendStatus(500);
        }

        return res.status(201).send({user_id:user_id})

       })
}


// Login: validate credentials, then return (or create) a session token
const login = (req, res) => {
     const schema= joi.object({
        email: joi.string().required(),
        password: joi.string().required(),
       }) .unknown(false);
    
       const{error} = schema.validate(req.body);
       console.log(error);
       if(error) return res.status(400).send({ error_message: error.details[0].message});
      
       users.authenticateUser(req.body.email, req.body.password, (err, user_id)=>{
        if(err === 404 || !user_id) return res.status(400).send({error_message:"Invalid email/password"})
        if(err) return res.sendStatus(500) 

        // If user already has a token, reuse it; otherwise create a new one
       users.getToken(user_id, (err, session_token)=>{
         if(err) return res.sendStatus(500)
          
         if(session_token){
            return res.status(200).send({user_id:user_id, session_token: session_token})
         }   

        users.setToken(user_id, (err,session_token)=>{
            if(err) return res.sendStatus(500)
            return res.status(200).send({user_id:user_id, session_token: session_token})
        })     
     })
   })
}


// Logout: delete/remove the current token
const logout = (req, res) =>{
    const token = req.headers['x-authorization'];

    users.removeToken(token,(err)=>{
    if(err) return res.sendStatus(500)
     return res.status(200).send({error_message:"Logged out successfully"});
    })
    
}

// Public profile endpoint: returns user info +items they are selling, bidding on, and auctions that have ended.
const profile_info = (req, res) =>{
    const user_id_str =  req.params.user_id;
  if (!/^\d+$/.test(user_id_str)) {
    return res.status(400).send({ error_message: "Invalid user_id" });
  }
     const user_id = parseInt(user_id_str, 10);

    users.getProfileInfo(user_id, (err,row)=>{
        if(err) return res.sendStatus(500)
        if(!row) return res.status(404).send({error_message: "Not Found"})  
            
        return res.status(200).send(row);
    })
}


module.exports = {
    create_account : create_account,
    login: login,
    logout: logout,
    profile_info: profile_info
}