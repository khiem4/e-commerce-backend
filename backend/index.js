require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Product = require('./models/product')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.post('/api/cart', async (req, res) => {
  const body = req.body

  if (body === undefined) {
    return res.status(400).json({ error: 'product missing' })
  }

  const product = new Product({
    title: body.title,
    thumbnail: body.thumbnail,
    price: body.price,
    quantity: body.quantity,
  })

  const savedProduct = await product.save()
  res.json(savedProduct)
})

app.get('/api/cart', async (req, res) => {
  const response = await Product.find({})
  res.json(response)
})

app.put('/api/cart', async (req, res) => {
  const { quantity, id } = req.body

  const updated = await Product.findByIdAndUpdate(id, { quantity }, { new: true })

  res.json(updated)
})

app.delete('/api/cart', async (req, res) => {
  const { id } = req.body

  await Product.findByIdAndRemove(id)
  res.status(204).send({ error: 'unknown endpoint' })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
