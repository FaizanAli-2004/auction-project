const db = require('../../database');

// Create a new auction item
const addNewItem = (item, done) => {
  const start_date = Math.floor(Date.now() / 1000);

let sql = 'INSERT INTO items (name, description, starting_bid, start_date, end_date, creator_id) VALUES(?,?,?,?,?,?)'
let values = [item.name, item.description, item.starting_bid,start_date, item.end_date, item.creator_id];

 db.run(sql, values, function(err){
        if(err) return done(err)    

        return done(null, this.lastID); 
    })
};


// Get item details along with creator info and current highest bid
const getSingleItem = (item_id, done)=> {
  let itemSql ='SELECT i.item_id, i.name, i.description, i.starting_bid, i.start_date, i.end_date, i.creator_id, ';
      itemSql += 'u.first_name, u.last_name ';
     itemSql+= 'FROM items i INNER JOIN users u ON i.creator_id = u.user_id Where i.item_id = ?';
  
    db.get(itemSql, [item_id],(err, row) =>{
      if(err) return done(err);
      if(!row) return done(null, null);

     const item = {
        item_id: row.item_id,
        name: row.name,
        description: row.description,
        starting_bid: row.starting_bid,
        start_date: row.start_date,
        end_date: row.end_date,
        creator_id: row.creator_id,
        first_name: row.first_name,
        last_name: row.last_name,
        current_bid: row.starting_bid,    
        current_bid_holder:null    // will fill if any bids
      }

      // Get highest bid and most recent(if any)
      let bidSql = 'SELECT b.amount, b.user_id, u.first_name, u.last_name ';
            bidSql += 'FROM bids b INNER JOIN users u ON b.user_id = u.user_id WHERE b.item_id = ? ';
            bidSql += 'ORDER BY b.amount DESC, b.timestamp DESC LIMIT 1';
      
      db.get(bidSql, [item_id], (err2,bidrow)=>{
        if (err2) return done(err2);
        if(bidrow) {
          item.current_bid = bidrow.amount;
          item.current_bid_holder = {
            user_id: bidrow.user_id,
            first_name: bidrow.first_name,
            last_name: bidrow.last_name
          };
        }
        return done(null,item);
      })
    })
}

// Add a new bid for an item
const addBid = (item_id,user_id,amount, done) =>{
  const timestamp = Math.floor(Date.now() / 1000); // unix seconds

  let sqlBid = 'INSERT INTO bids(item_id, user_id, amount, timestamp) VALUES (?,?,?,?)';
  const values = [item_id, user_id,amount,timestamp];

    db.run(sqlBid, values, function (err){
      if(err) return done(err)    
      return done(null);
      })
     };


 // Get all bid history for an item (highest first)    
const bidHistory = (item_id, done)=>{
  let bidSql ='SELECT b.user_id, b.amount, b.timestamp,b.item_id, u.first_name, u.last_name ';
    bidSql+= 'FROM bids b INNER JOIN USERS u ON b.user_id = u.user_id Where b.item_id = ? ';
    bidSql+= 'ORDER BY b.amount DESC, b.timestamp DESC';
    
    db.all(bidSql,[item_id],(err, rows)=>{
    if(err) return done(err);

     const finalResult = rows.map(item => ({
        item_id: item.item_id,
      amount: item.amount,
      timestamp: item.timestamp,
      user_id: item.user_id,
      first_name: item.first_name,
      last_name: item.last_name
     }))
      return done(null, finalResult);
    })
}


   


// q: search string (can be null)
// status: BID / OPEN / ARCHIVE / null
// limit, offset: for pagination
const searchItems = (q, status, user_id, limit, offset, done) => {
    const currentTime = Math.floor(Date.now() / 1000);  
    let sql = "";
    const params = [];

    if (status === "BID") {
        // Items that the current user has bid on
        sql = ` SELECT DISTINCT i.item_id, i.name, i.description, i.end_date, i.creator_id, u.first_name, u.last_name
            FROM items i
            INNER JOIN bids b ON b.item_id = i.item_id
            INNER JOIN users u ON i.creator_id = u.user_id
            WHERE b.user_id = ?
        `;
        params.push(user_id);


    } else if (status === "OPEN") {
        // Items created by this user and still active
        sql = ` SELECT i.item_id, i.name, i.description, i.end_date, i.creator_id, u.first_name, u.last_name
            FROM items i
            INNER JOIN users u ON i.creator_id = u.user_id
            WHERE i.creator_id = ?
            AND i.end_date > ?
        `;
        params.push(user_id);
        params.push(currentTime);


    } else if (status === "ARCHIVE") {
        // Items created by this user but closed
        sql = ` SELECT i.item_id, i.name, i.description, i.end_date, i.creator_id, u.first_name, u.last_name
            FROM items i
            INNER JOIN users u ON i.creator_id = u.user_id
            WHERE i.creator_id = ?
            AND i.end_date <= ?
        `;
        params.push(user_id);
        params.push(currentTime);


    } else {
        // No status filter: just search all active items
        sql = ` SELECT i.item_id, i.name, i.description, i.end_date, i.creator_id, u.first_name, u.last_name
            FROM items i
            INNER JOIN users u ON i.creator_id = u.user_id
            WHERE i.end_date > ?
        `;
        params.push(currentTime);
      
    }

    // If q is given, filter by name
    if (q) {
        sql += ` AND i.name LIKE ?`;
        params.push("%" + q + "%");
    }

    // Add sorting + pagination. (newest items first)
    sql += `
        ORDER BY i.item_id DESC
        LIMIT ? OFFSET ?
    `;
    params.push(limit);
    params.push(offset);

    // Run the query
    db.all(sql, params, (err, rows) => {
        if (err) {
            return done(err);
        }

        const finalResult = rows.map(row => ({
            item_id: row.item_id,
            name: row.name,
            description: row.description,
            end_date: row.end_date,
            creator_id: row.creator_id,
            first_name: row.first_name,
            last_name: row.last_name
        }));
        return done(null, finalResult);
    });
};

 



module.exports = {
  addNewItem,
  getSingleItem,
  addBid,
  bidHistory,
  searchItems
};




