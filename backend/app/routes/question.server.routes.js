const quest = require ("../controllers/question.server.controllers")
const authn = require('../lib/authentication');

// Routes related to item's questions and answers
module.exports = function(app){
    app.route("/item/:item_id/question")
        .get(quest.get_questions);
    
    app.route("/item/:item_id/question")
        .post(authn.isAuthenticated, quest.ask_question);
    
    app.route("/question/:question_id")
        .post(authn.isAuthenticated, quest.answer_question);
}