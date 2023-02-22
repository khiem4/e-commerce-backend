const jwt = require('jsonwebtoken')
const cartRouter = require('express').Router()
const Product = require('../models/product')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

cartRouter.get('/', async (req, res) => {
  const response = await Product
    .find({})
    .populate('user', { username: 1 })

  res.json(response)
})

cartRouter.post('/', async (req, res) => {
  const { title, thumbnail, price, quantity } = req.body

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const product = new Product({
    title,
    thumbnail,
    price,
    quantity,
    user: user.id
  })

  const savedProduct = await product.save()
  user.products = user.products.concat(savedProduct._id)
  await user.save()

  res.json(savedProduct)
})

cartRouter.put('/', async (req, res) => {
  const { quantity, id } = req.body

  const updated = await Product
    .findByIdAndUpdate(
      id, { quantity }, { new: true }
    )

  res.json(updated)
})

cartRouter.delete('/:id', async (req, res) => {
  const { id } = req.params

  await Product.findByIdAndRemove(id)
  res.status(204).end()
})

module.exports = cartRouter