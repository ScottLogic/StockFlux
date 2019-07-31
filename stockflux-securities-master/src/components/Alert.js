import React from "react";
import "./Alert.css";
import PropTypes from "prop-types";

const Alert = ({ messages, type, className }) => {
  return (
    <div className={`securities-alert-container ${className}`}>
      {Array.isArray(messages) && messages.length > 1 ? (
        <ul>
          {messages.map((message, index) => (
            <li className={`securities-alert ${type}`} key={index}>
              {message}
            </li>
          ))}
        </ul>
      ) : (
        <div className={`securities-alert ${type}`}>{messages}</div>
      )}
    </div>
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
