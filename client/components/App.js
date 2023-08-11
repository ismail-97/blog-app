/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from 'react'
import Blog from './Blog'
import LoginForm from './LoginForm'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import Notification from './Notification'
import blogService from '../util/services/blogs'
import loginService from '../util/services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (userObject) => {
    try {
      const user = await loginService.login(userObject)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
    } catch (exception) {
      setMessage('wrong credentials')
      setTimeout(() => {
        setMessage('')
      }, 2000)
    }
  }

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      setMessage('blog is added successfully')
      setTimeout(
        () => setMessage(''),
        2000,
      )
    } catch (exception) {
      setMessage('you had a mistake adding this message')
      setTimeout(() => {
        setMessage('')
      }, 2000)
    }
  }

  const addLike = async (blogId, newLikes) => {
    try {
      await blogService.updateLikes(blogId, newLikes)
      setMessage('likes increased')
      setTimeout(
        () => setMessage(''),
        2000,
      )
    } catch (exception) {
      setMessage('you had a mistake adding likes')
      setTimeout(() => {
        setMessage('')
      }, 2000)
    }
  }

  const deleteBlog = async (blogId) => {
    if (window.confirm('Do you really want to leave?')) {
      try {
        await blogService.removeBlog(blogId)
        const blogsAfterDeletion = blogs.filter((blog) => blog.id !== blogId)
        setBlogs(blogsAfterDeletion)
        setMessage('blog deleted')
        setTimeout(
          () => setMessage(''),
          2000,
        )
      } catch (exception) {
        setMessage('cannot delete blog')
        setTimeout(() => {
          setMessage('')
        }, 2000)
      }
    }
  }

  return (
    <div>
      <Notification message={message} />
      <h2>blogs</h2>
      {!user
        && (
        <Togglable buttonLabel="login">
          <LoginForm handleLogin={handleLogin} />
        </Togglable>
        )}
      {user
        && (
        <div style={{ fontWeight: 'bold', marginBottom: 15 }}>
          {user.username}
          {' '}
          logged in
        </div>
        )}
      {user
        && (
        <Togglable buttonLabel="create">
          <BlogForm addBlog={addBlog} />
        </Togglable>
        )}

      {user
        && blogs
          .sort((b1, b2) => b1.likes - b2.likes) // sort by providing comparison function
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              addLike={addLike}
              deleteBlog={deleteBlog}
            />
          ))}

    </div>
  )
}

export default App
