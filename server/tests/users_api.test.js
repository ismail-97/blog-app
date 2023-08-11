/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')
const helper = require('./helper')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  for (const user of helper.initialUsers) {
    await api
      .post('/api/users')
      .send(user)
      .expect(200)
  }
})

describe('creation of a user', () => {
  test('succeeds with valid data', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'rawan',
      username: 'rawan dewidar',
      password: '123Edsaqww',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const users = usersAtEnd.map((u) => u.username)
    expect(users).toContain(newUser.username)
  })

  test('fails without password', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'rawan',
      username: 'rawan dewidar',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const users = usersAtEnd.map((u) => u.username)
    expect(users).not.toContain(newUser.username)
  })

  test('fails with password less than 3 chars', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'rawan',
      username: 'rawan dewidar',
      password: '1s',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const users = usersAtEnd.map((u) => u.username)
    expect(users).not.toContain(newUser.username)
  })

  test('fails with repeated usernames', async () => {
    const usersAtStart = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(helper.initialUsers[0])
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
