import PropTypes from "prop-types";

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="notification error">{message}</div>;
};

Notification.propTypes = { message: PropTypes.string };

export default Notification;
