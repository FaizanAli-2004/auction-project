const joi = require("joi");
const questions = require('../models/question.server.models');
const users = require('../models/user.server.models');
const items = require('../models/core.server.models');
const { containsProfanity } = require('../utils/profanityFilter');

/**
 * Returns all questions (and answers) for a given item.
 * First checks that the item exists, then fetches its questions.
 */
const get_questions = (req, res) => {
    const item_id = parseInt(req.params.item_id);

    if (isNaN(item_id)) return res.status(400).send({ error_message: "Invalid item id" });

    items.getSingleItem(item_id, (err, item) => {
        if (err) return res.sendStatus(500);
        if (!item) return res.status(404).send({error_message: "No item Found"})
        
        questions.getQuestions(item_id, (err,row)=>{
            if(err) return res.sendStatus(500)
            return res.status(200).send(row);
        })
    })
}


/**  Allows logged-in user to ask a question on an item.
 * The user must not be the item owner, and the question must pass validation
 * and profanity checks.
 */
const ask_question = (req, res) => {
    const token = req.headers['x-authorization'];
    const item_id = parseInt(req.params.item_id);
    const question = req.body.question_text;
    
     if (isNaN(item_id)) {
     return res.status(400).send({ error_message: "Invalid item_id" });
     }

     const schema= joi.object({
            question_text: joi.string().required(),
           }).unknown(false);
           const{error} = schema.validate(req.body);
           if(error) return res.status(400).send({error_message: error.details[0].message});
    
     if (containsProfanity(question)) {
            return res.status(400).json({ error_message: "Question contains inappropriate language" });
        }

if (!token) return res.sendStatus(401);
    users.getUserIdFromToken(token, (err, user_id)=>{
      if(err) return res.sendStatus(500);
      if(!user_id) return res.sendStatus(401);
     
     items.getSingleItem(item_id, (err2, item)=>{
       if(err2) return res.sendStatus(500);
       if(!item) return res.status(404).send({error_message: "Not Found"});
             
       if(item.creator_id === user_id){
                 return res.status(403).send({ error_message: "You cannot ask a question on your own item" });
             }
       const questionInfo ={
        question: question,
        asked_by : user_id,
        item_id: item_id
       }

       questions.askQuestion(questionInfo, (err3,question_id)=>{
        if(err3) return res.status(500).send(err3);
        
        return res.sendStatus(200);
       })
     }) 
 })
}


// Allow the item owner to answer a question
const answer_question = (req, res) =>{
    const token = req.headers['x-authorization'];
    const question_id = parseInt(req.params.question_id);
    const answer = req.body.answer_text;
    if (isNaN(question_id)) {
     return res.status(400).send({ error_message: "Invalid question_id" });
     }

    const schema= joi.object({
            answer_text: joi.string().required(),
           }).unknown(false);
           const{error} = schema.validate(req.body);
           if(error) return res.status(400).send({error_message: error.details[0].message});

     if (containsProfanity(answer)) {
            return res.status(400).json({ error_message: "Answer contains inappropriate language" });
        }

        users.getUserIdFromToken(token, (err, user_id)=>{
        if(err) return res.sendStatus(500);
        if(!user_id) return res.sendStatus(401);
        
        questions.getItemIdFromQuestId(question_id, (err2, id_row)=>{
        if(err2) return res.sendStatus(500);
        if(!id_row) return res.sendStatus(404);
        

         items.getSingleItem(id_row.item_id, (err3, item)=>{
        if(err3) return res.sendStatus(500);
        if(!item) return res.status(404).send({error_message: "Not Found"});
     
        if(item.creator_id !== user_id){
                 return res.status(403).send({ error_message: "Only the seller can answer questions on their items" });
             }

        questions.answQuestion(answer,question_id, (err4)=>{
        if(err4) return res.status(500).send(err4);
        
        return res.sendStatus(200)
           })
        })
      });   
    }) 
}
 



module.exports = {
    get_questions : get_questions,
    ask_question: ask_question,
    answer_question: answer_question
}