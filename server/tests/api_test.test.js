/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')
const helper = require('./helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)
let token = null

beforeEach(async () => {
  await User.deleteMany({})
  const sampleUser = {
    name: 'test',
    username: 'for testing',
    password: '123Edsaqww',
  }
  await api.post('/api/users').send(sampleUser)

  const loginResponse = await api
    .post('/api/login')
    .send({
      username: 'for testing',
      password: '123Edsaqww',
    })
    .expect(200)

  token = loginResponse.body.token
  const userId = loginResponse.body.id

  await Blog.deleteMany({})
  for (const blog of helper.initialBlogs) {
    const newBlog = new Blog({ ...blog, user: userId })
    await newBlog.save()
  }
})

describe('retrieving notes', () => {
  test('all notes returned in JSON format', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('unique identifier property of the blog posts is named id', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body[0].id).toBeDefined()
  })
})

describe('adding notes', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'Go To Hell',
      author: 'sarah soysal',
      url: 'ss.com',
      likes: 5,
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  })

  test('likes property is set to 0 if it is missing from the request ', async () => {
    const newBlog = {
      title: 'Go To Hell',
      author: 'sarah soysal',
      url: 'ss.com',
    }
    const addedBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(addedBlog.body.likes).toBe(0)
  })

  test('fails if URL property is missing from the request ', async () => {
    const newBlog = {
      title: 'Go To Hell',
      author: 'sarah soysal',
      // likes: 5
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    // const blogsAtEnd = await helper.blogsInDb()
    // expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds if id is valid and exists', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map((b) => b.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('updating a note', () => {
  test('succeeds with valid data', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const result = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: 39 })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body.likes).toBe(39)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
