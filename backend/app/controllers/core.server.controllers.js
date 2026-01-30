const joi = require("joi");
const items = require('../models/core.server.models');
const users = require('../models/user.server.models');
const { containsProfanity } = require('../utils/profanityFilter');


// Create a new auction item
const create_item = (req, res) => {
    const token = req.headers['x-authorization'];
      if (!token) return res.sendStatus(401); 
      console.log(token);

      users.getUserIdFromToken(token,(err, user_id)=> {
        if(err) return res.sendStatus(500);
        if(!user_id) return res.sendStatus(401);
      
     const schema= joi.object({
        name: joi.string().required(),
        description: joi.string().required(),
        starting_bid: joi.number().integer().min(1).required(),
        end_date: joi.number().integer().required()
       }).unknown(false);
        
           const{error} = schema.validate(req.body);
           if(error) return res.status(400).send({error_message: error.details[0].message});

           // Profanity checks
         if (containsProfanity(req.body.name)) {
                return res.status(400).json({ error_message: "Item name contains inappropriate language" });
                }

        if (containsProfanity(req.body.description)) {
                return res.status(400).json({ error_message: "Item description contains inappropriate language" });
                }
      
        const currentTime = Math.floor(Date.now() / 1000);
        if (req.body.end_date <= currentTime) {
            return res.status(400).send({ error_message: "End date must be in the future" });
        }

     const  item = {
        ...req.body,
        creator_id: user_id
    };

      items.addNewItem(item, (err,item_id)=> {
        if(err) return res.status(500).send(err);
    
         return res.status(201).send({item_id:item_id})
      })
    })
}


// Place a bid on an item (with validation, ownership checks, and auction rules)
const  bid_item = (req, res) =>{
   const token = req.headers['x-authorization'];
   const item_id_str = req.params.item_id;
   const amount = req.body.amount;
 
  if (!/^\d+$/.test(item_id_str)) {
     return res.status(400).send({ error_message: "Invalid item_id" });
  }

  const item_id = parseInt(item_id_str, 10);


   if (!token) return res.sendStatus(401);

  const schema= joi.object({
        amount: joi.number().integer().min(1).required()
       }).unknown(false);

        const{error} = schema.validate(req.body);
        if(error) return res.status(400).send({error_message: error.details[0].message});

   
   users.getUserIdFromToken(token,(err, user_id)=> {
        if(err) return res.sendStatus(500);
        if(!user_id) return res.sendStatus(401);

        items.getSingleItem(item_id, (err2, item)=>{
        if(err2) return res.sendStatus(500);
        if(!item) return res.status(404).send({error_message: "Item Not Found"});
        
        if(item.creator_id === user_id){
            return res.status(403).send({ error_message: "You cannot bid as the seller on this item" });
        }
         
        // Determine the minimum allowed bid (must be higher than current bid or starting bid)
        const minimumBidAmount = item.current_bid + 1;
        if(amount < minimumBidAmount){
            return res.status(400).send({error_message:`Bid must be at least ${minimumBidAmount}`}) 
        }

         const currentDate = Math.floor(Date.now() / 1000);
        if(item.end_date <= currentDate ){
            return res.status(400).send({error_message: "Bidding has closed on this item" })
        }

        items.addBid(item_id, user_id,amount,(err3)=>{
            if(err3) return res.sendStatus(500);

            return res.sendStatus(201);
        })
      })  
   })
}


// Return full details of a single item (including seller info and current highest bid)
const item_details = (req, res) =>{
     const item_id_str = req.params.item_id;
  if (!/^\d+$/.test(item_id_str)) {
     return res.status(400).send({ error_message: "Invalid item_id" });
  }

  const item_id = parseInt(item_id_str, 10);

    items.getSingleItem(item_id, (err,row) =>{
        if(err){
            console.log("Error: " , err)
        return res.sendStatus(500)
        }
       if(!row) return res.status(404).send({ error_message: "No item found with that id" });


        return res.status(200).send(row);
    })
}



// get bid history for an item (only if the item exists)
const bid_history = (req, res) => {
     const item_id_str = req.params.item_id;
  if (!/^\d+$/.test(item_id_str)) {
     return res.status(400).send({ error_message: "Invalid item_id" });
  }

  const item_id = parseInt(item_id_str, 10);

    items.getSingleItem(item_id, (err, item) => {
        if (err) return res.sendStatus(500);

        if (!item) return res.status(404).send({ error_message: "Item not found" });

        items.bidHistory(item_id, (err2, result) => {
            if (err2) return res.sendStatus(500);

            return res.status(200).send(result);
        });
    });
};



// Search items with optional query + status filters, includes pagination and 
// input validation (status filters require authentication)
const search_item = (req, res) => {
    const q = req.query.q || null;
    const status = req.query.status || null;

    // limit and offset with defaults
    let limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
    let offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;

    //validation for limit / offset 
    if (isNaN(limit) || isNaN(offset)) {
        return res.status(400).send({ error_message: "limit and offset must be numbers" });
    }

    if (limit < 1 || limit > 100) {
        return res.status(400).send({ error_message: "limit must be between 1 and 100" });
    }

    if (offset < 0) {
        return res.status(400).send({ error_message: "offset must be 0 or greater" });
    }

    //validation for status filter
    const allowedStatuses = ["BID", "OPEN", "ARCHIVE"];
    if (status && !allowedStatuses.includes(status)) {
        return res.status(400).send({ error_message: "status must be BID, OPEN, or ARCHIVE" });
    }

    //helper to Runs the search and returns results
    const runSearch = (user_id) => {
        items.searchItems(q, status, user_id, limit, offset, (err, result) => {
            if (err) return res.sendStatus(500);
            return res.status(200).send(result);
        });
    };

    if (status) {
        const token = req.headers['x-authorization'];
        if (!token) {
          return res.status(400).send({ error_message: "status requires authentication" });
        }

        users.getUserIdFromToken(token, (err, user_id) => {
            if (err) return res.sendStatus(500);
            if (!user_id) return res.sendStatus(401);

            runSearch(user_id);
        });
    }else {
      //public search
        runSearch(null);
    }
};




module.exports = {
    search_item : search_item,
    create_item: create_item,
    item_details: item_details,
    bid_item: bid_item,
    bid_history: bid_history,
    
}
