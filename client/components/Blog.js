/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/button-has-type */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable import/no-extraneous-dependencies */
import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({
  blog, user, addLike, deleteBlog,
}) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const increaseLikes = () => {
    addLike(blog.id, likes + 1)
    setLikes(likes + 1)
  }

  const removeBlog = () => deleteBlog(blog.id)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => setVisible(!visible)

  return (

    <div style={blogStyle}>
      <div className="blog-title">
        {blog.title}
        {' '}
        {blog.author}
        {' '}
        {''}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      <div style={showWhenVisible} className="blog-body">
        <div>
          {blog.url}
          {' '}
        </div>
        <div>
          likes
          {' '}
          {likes}
          <button onClick={increaseLikes}>like</button>
        </div>
        <div>{user.username}</div>
        <button onClick={removeBlog}>remove</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
}
export default Blog
