const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => {
    console.log(`connect to ${url}`)
  })
  .catch(() => {
    console.log('error can\'t connect')
  })

const productSchema = new mongoose.Schema({
  title: String,
  thumbnail: String,
  price: Number,
  quantity: Number,
})

productSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Product', productSchema)
