// Utility function to check if a given text contains profanity
const  BadWordsFilter = require('bad-words');
const profanityChecker = new  BadWordsFilter();

const containsProfanity = (text) => {
    if (!text || typeof text !== 'string') return false;
    return profanityChecker.isProfane(text);  
};

module.exports = { containsProfanity };
