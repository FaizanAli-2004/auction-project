//helpers for users
const crypto = require('crypto');
const db = require('../../database');

//Hash a password using PBKDF2 
const getHash = function(password, salt){
    return crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
}

// Create a new user account (stores hashed password + salt)
const addNewUser =  (user, done)=>{
    const salt = crypto.randomBytes(64);
    const hash = getHash(user.password, salt);

    const sql = 'INSERT INTO users (first_name, last_name, email, password, salt) VALUES(?,?,?,?,?)'
    let values = [user.first_name, user.last_name, user.email, hash, salt.toString('hex')];

    db.run(sql, values, function(err){
        if(err) return done(err)

        return done(null, this.lastID); // new user id
    })
};


// Check login details: look up user by email, hash the provided password, then compare
const authenticateUser =(email, password, done) =>{
    const sql = 'Select user_id, password, salt From users Where email=?'

    db.get(sql, [email], (err, row)=> {
        if(err) return done(err);
        if(!row) return done(404)

        if(row.salt === null) row.salt = ''
        
        let salt = Buffer.from(row.salt, 'hex')

        if(row.password === getHash(password, salt)){
            return done(false, row.user_id)
        }
        else{
            return done(404)
        }
    })
}

// Get the current session token for a user (if they have one)
const getToken = (id, done) => {
 const sql = 'Select session_token FROM users Where user_id=?'

 db.get(sql,[id], (err, row)=> {
    if(err) return done(err)
    if(!row) return done(404)
    return done(null, row.session_token);
  })
}

// Create and store a new session token for a user 
const setToken =(id, done) => {
 let token = crypto.randomBytes(16).toString('hex');

 const sql = 'UPDATE users Set session_token=? Where user_id=?'

 db.run(sql, [token, id], (err)=>{
    return done(err, token)
  })
}

// Logout: remove the token by updating session_token to null
const removeToken = (token, done) => {
    const sql = 'UPDATE users SET session_token=null WHERE session_token=?'

    db.run(sql, [token], (err)=>{
        return done(err)
    })
}


// Get the user ID linked to a session token
const getUserIdFromToken = (token, done)=> {
   const sql = 'Select user_id FROM users Where session_token=?'

   db.get(sql,[token], (err, row)=> {
    if(err) return done(err)
    if(!row) return done(404)
    return done(null, row.user_id);
  })

}


// Build profile data: basic user info + what they're selling + what they're bidding on
 const getProfileInfo =(user_id,done) =>{
    const userSql = 'SELECT user_id, first_name, last_name FROM users WHERE user_id =?'
      const currentDate = Math.floor(Date.now() / 1000); 

    db.get(userSql, [user_id], (err, userRow)=>{
        if(err) return done(err);
        if(!userRow) return done(null, null)

       const profileInfo = {
        user_id : userRow.user_id,
        first_name: userRow.first_name,
        last_name: userRow.last_name,
        selling: [],
        bidding_on: [],
        auctions_ended: []
       }
       
        // Get all items created by this user, then split them into active/ended
       let itemSql = 'SELECT i.item_id, i.name, i.description, i.end_date, i.creator_id, u.first_name, u.last_name '
           itemSql += 'FROM items i INNER JOIN users u ON u.user_id = i.creator_id WHERE i.creator_id=?'

       db.all(itemSql, [user_id], (err2, items)=>{
         if(err2) return done(err2);

         
            items.forEach(item=> {
            if(item.end_date>currentDate){
                profileInfo.selling.push(item);
            }
            if(item.end_date <=currentDate){
                    profileInfo.auctions_ended.push(item);
                }
            })
    
        // Get items the user has placed bids on (distinct items) - newest bid first
        let bidSql = 'SELECT i.item_id, i.name, i.description, i.end_date, i.creator_id, u.first_name, u.last_name, ';
            bidSql += 'MAX(b.timestamp) AS last_bid_time ';
            bidSql += 'FROM bids b INNER JOIN items i ON b.item_id = i.item_id ';
            bidSql += 'INNER JOIN users u ON i.creator_id = u.user_id ';
            bidSql += 'WHERE b.user_id = ? ';
            bidSql += 'GROUP BY i.item_id ';
            bidSql += 'ORDER BY last_bid_time DESC';

        db.all(bidSql, [user_id], (err3, bidItems)=>{
            if(err3) return done(err3);
            bidItems.forEach(item => {
             profileInfo.bidding_on.push(item);
               });  
                return done(null, profileInfo);
            }) 
        })
    })
}


module.exports = {
  addNewUser,
  authenticateUser,
  getToken,
  setToken,
  removeToken,
  getUserIdFromToken,
  getProfileInfo,
};
