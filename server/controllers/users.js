/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', {
      url: 1, title: 1, author: 1, likes: 1,
    })

  response.status(200).json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!(password && password.length > 3)) {
    return response.status(400).json({
      error: 'password must be provided & more than 3 chars',
    })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(200).json(savedUser)
})

module.exports = usersRouter
