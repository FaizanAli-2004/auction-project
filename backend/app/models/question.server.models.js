const db = require('../../database');

// Save a new question for an item
const askQuestion=(questionInfo, done)=>{
    const sql ='INSERT INTO questions (question,  asked_by, item_id) VALUES(?,?,?)';
    let values = [questionInfo.question, questionInfo.asked_by, questionInfo.item_id];

    db.run(sql, values, function(err){
        if(err) return done(err)

        return done(null, this.lastID) // return new question id
    })
}


// Add an answer to an existing question
const answQuestion = (answer,question_id, done)=> {
  const sql = 'UPDATE questions SET answer = ? WHERE question_id = ?';

  db.run(sql, [answer, question_id], function(err){
     if(err) return done(err)
      if (this.changes === 0) { 
            return done(null, null);
        }
     return done(null)
  })
}

// Get all  questions (and answers) for a specific item, latest first
const getQuestions =(item_id, done)=>{
  let sql = 'SELECT question_id, question AS question_text, answer AS answer_text FROM questions WHERE item_id =? '
      sql += 'ORDER BY question_id DESC';

  db.all(sql, [item_id], (err, rows)=>{
    if(err) return done(err)
    return done(null,rows);
  })
}

//Get item_id to specific question
const getItemIdFromQuestId =(question_id, done)=>{
  const sql = 'SELECT item_id FROM questions WHERE question_id =?';

  db.get(sql, [question_id], (err, row)=>{
    if(err) return done(err)
    if(!row) return done(null,null)
    return done(null,row);

  })
}

module.exports = {
  askQuestion,
  answQuestion,
  getQuestions,
  getItemIdFromQuestId
};