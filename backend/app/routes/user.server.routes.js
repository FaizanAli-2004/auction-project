const users = require ("../controllers/user.server.controllers")
const authn = require('../lib/authentication');

// Routes to handles account creation,login,logout profile access
module.exports = function(app){
    app.route("/users")
        .post(users.create_account);
    
    app.route("/login")
        .post(users.login);
    
    app.route("/logout")
        .post(authn.isAuthenticated, users.logout);

    app.route("/users/:user_id")
        .get(users.profile_info)
}



