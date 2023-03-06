const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
console.log('MONGODB_URI:', MONGODB_URI)

module.exports = {
  MONGODB_URI,
  PORT
}