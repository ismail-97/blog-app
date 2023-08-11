/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  console.log('i am here in api/blogs')
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})
blogsRouter.use(middleware.tokenExtractor)
blogsRouter.use(middleware.userExtractor)

blogsRouter.post('/', async (request, response) => {
  const { body } = request
  const user = await User.findById(request.user)

  if (!user) {
    return response.status(400).json({
      error: `there is no user with this id ${request.user}`,
    })
  }
  const blog = new Blog({
    ...body,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(400).json({
      error: 'there is no blog with this id',
    })
  }
  if (blog.user.toString() === request.user.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
  } else {
    return response.status(400).json({
      error: 'a user can only delete his own blogs',
    })
  }

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes },
    { new: true, runValidators: true, context: 'query' },
  )
  if (updatedBlog) {
    response.json(updatedBlog).status(200)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter
