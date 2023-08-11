/* eslint-disable no-undef */
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import '@testing-library/jest-dom/extend-expect'

describe('<BlogForm />', () => {
  // eslint-disable-next-line no-unused-vars
  let container
  const addBlog = jest.fn()

  beforeEach(() => {
    container = render(
      <BlogForm addBlog={addBlog} />,
    ).container
  })

  test('event handler called with right detials', async () => {
    const user = userEvent.setup()

    const inputs = screen.getAllByRole('textbox')
    await user.type(inputs[0], 'a blog added from test case...')
    await user.type(inputs[1], 'test file...')
    await user.type(inputs[2], 'www.nourl.com...')
    const submitButton = screen.getByText('create')
    await user.click(submitButton)

    expect(addBlog.mock.calls).toHaveLength(1)
    expect(addBlog.mock.calls[0][0].title)
      .toBe('a blog added from test case...')
    expect(addBlog.mock.calls[0][0].author)
      .toBe('test file...')
    expect(addBlog.mock.calls[0][0].url)
      .toBe('www.nourl.com...')
  })
})
