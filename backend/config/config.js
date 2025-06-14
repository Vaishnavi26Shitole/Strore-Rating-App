require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  DB_URI: process.env.DB_URI || 'mongodb://localhost:27017/store_rating_app',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000'
};