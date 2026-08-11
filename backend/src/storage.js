const { createQuote, listQuotesByUser } = require('./database');

function saveQuote(userId, quoteData) {
  return createQuote(userId, quoteData);
}

function listQuotes(userId) {
  return listQuotesByUser(userId);
}

module.exports = { saveQuote, listQuotes };
