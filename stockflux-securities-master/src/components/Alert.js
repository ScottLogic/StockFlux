import React from "react";
import "./Alert.css";

const Alert = ({ messages, type, className }) => {
  return (
    <ul className={`securities-alert-container ${className}`}>
      {messages.map((message, index) => {
        return (
          <li className={`securities-alert ${type}`} key={index}>
            {message}
          </li>
        );
      })}
    </ul>
  );
};

export default Alert;
