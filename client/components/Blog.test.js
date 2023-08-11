/* eslint-disable no-undef */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container; let blog; let
    user
  const addLike = jest.fn()
  const deleteBlog = jest.fn()

  beforeEach(() => {
    blog = {
      title: 'a blog added from test case',
      author: 'test file',
      url: 'www.nourl.com',
    }

    user = {
      username: 'ismail dewidar',
    }

    container = render(
      <Blog
        blog={blog}
        user={user}
        addLike={addLike}
        deleteBlog={deleteBlog}
      />,
    ).container
  })

  test('blog\'s title and auhtor are rendered by default', () => {
    let div = container.querySelector('.blog-title')
    expect(div).not.toHaveStyle('display: none')
    expect(div).toHaveTextContent(
      'a blog added from test case test file',
    )

    div = container.querySelector('.blog-body')
    expect(div).toHaveStyle('display: none')
  })

  test('blog\'s body rendered by clicking on view button', async () => {
    let div = container.querySelector('.blog-body')
    expect(div).toHaveStyle('display: none')

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    div = container.querySelector('.blog-body')
    expect(div).not.toHaveStyle('display: none')
    expect(div).toHaveTextContent('www.nourl.com')
  })

  test('when like button clicked twice, event handler called twice', async () => {
    const likeButton = screen.queryByText('like')
    const user = userEvent.setup()
    await user.click(likeButton)
    await user.click(likeButton)
    expect(addLike.mock.calls).toHaveLength(2)
  })
})
