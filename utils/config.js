require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = String(process.env.MONGODB_URI)

module.exports = {
  MONGODB_URI,
  PORT
}