import React from "react";
import "./Alert.css";
import PropTypes from "prop-types";

export function AlertType(value) {
  this._value = value;
}

AlertType.prototype.valueOf = function() {
  return this._value;
};

AlertType.ERROR = new AlertType("error");
AlertType.SUCCESS = new AlertType("success");

const Alert = ({ messages, type }) => (
  <div className="securities-alert-container">
    {Array.isArray(messages) && messages.length > 1 ? (
      <ul>
        {messages.map((message, index) => (
          <li className={`securities-alert ${type.valueOf()}`} key={index}>
            {message}
          </li>
        ))}
      </ul>
    ) : (
      <div className={`securities-alert ${type.valueOf()}`}>{messages}</div>
    )}
  </div>
);

Alert.propTypes = {
  messages: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired,
  type: PropTypes.instanceOf(AlertType).isRequired
};

export default Alert;
