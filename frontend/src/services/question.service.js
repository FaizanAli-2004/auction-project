
// Fetch all questions for a specific item
const getQuestions =(itemId) =>{
    return fetch(`http://localhost:3333/item/${itemId}/question`)
      .then((response)=>{
        if(response.status === 200){
            return response.json();
        }else if(response.status === 400 || response.status === 404){
            return response.json().then((body) => {
                throw body.error_message;
            })
        }
        else{
            throw "Failed to fetch question"
        }
      })
      .then((resJson)=>{
        return resJson;
      })
      .catch((err) => {
        console.log("Get question error:", err);
        return Promise.reject(err);
      })
}


// Ask a new question on an item (requires authentication)
const askQuestion = (itemId, questionText, token) => {
    return fetch(`http://localhost:3333/item/${itemId}/question`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-authorization": token
        },
        body: JSON.stringify({ question_text: questionText })
    })
        .then((response) => {
            if (response.status === 200) {
         return; 
      } else if (response.status === 400 || response.status ===403 || response.status ===404) {
        return response.json().then((body) => {
          throw body.error_message;
        });
      } 
      else if (response.status === 401) {
        throw "Not logged in";
      }  else {
        throw "Failed to ask question";
      }
    })
        .then((resJson) => {
            return resJson;
        })
        .catch((err) => {
            console.log("Ask question error:", err);
            return Promise.reject(err);
        });
};


// Answer an existing question (seller only, requires authentication)
const answerQuestion = (questionId, answerText, token) => {
     return fetch(`http://localhost:3333/question/${questionId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-authorization": token
        },
        body: JSON.stringify({ answer_text: answerText })
    })
      .then((response) => {
      if (response.status === 200) {
        return;
      } else if (response.status === 400 || response.status === 403) {
        return response.json().then((body) => {
          throw body.error_message;
        });
      } else if (response.status === 401) {
        throw "Not logged in";
      }else if (response.status === 404) {
        return response.json()
          .then((body) => { throw body.error_message; })
          .catch(() => { throw "Not Found"; });
      } else {
        throw "Failed to answer question";
      }
    })
        .catch((err) => {
            console.log("Answer question error:", err);
            return Promise.reject(err);
        });
};


// Export question related API calls
export const questionService = {
    getQuestions,
    askQuestion,
    answerQuestion
}