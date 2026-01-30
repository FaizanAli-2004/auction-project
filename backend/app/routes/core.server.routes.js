const items = require ("../controllers/core.server.controllers")
const authn = require('../lib/authentication');

// Routes related to items, bidding, and searching
module.exports = function(app){
    app.route("/search")
        .get(items.search_item);
    
    app.route("/item")
        .post(authn.isAuthenticated, items.create_item); //(authentication required to access this endpoint)
    
    app.route("/item/:item_id")
        .get(items.item_details);

    app.route("/item/:item_id/bid")
        .post(authn.isAuthenticated, items.bid_item);
    
    app.route("/item/:item_id/bid")
        .get(items.bid_history);
}
