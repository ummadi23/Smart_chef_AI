require('dotenv').config();

module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY
};