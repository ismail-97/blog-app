/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable import/no-extraneous-dependencies */
import PropTypes from 'prop-types'

const Notification = ({ message }) => {
  if (message === '') {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string.isRequired,
}

export default Notification
