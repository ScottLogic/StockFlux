import React from "react";
import "./Alert.css";
import PropTypes from "prop-types";

const Alert = ({ messages, type, className }) => {
  return (
    <ul className={`securities-alert-container ${className}`}>
      {(Array.isArray(messages) ? messages : [messages]).map(
        (message, index) => (
          <li className={`securities-alert ${type}`} key={index}>
            {message}
          </li>
        )
      )}
    </ul>
  );
};

Alert.propTypes = {
  messages: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired,
  type: PropTypes.oneOf(["error", "success"]).isRequired,
  className: PropTypes.string
};

export default Alert;
