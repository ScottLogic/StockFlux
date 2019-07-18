import React from "react";
import "./ErrorMessage.css";

const ErrorMessage = ({ errorMessage }) => {
  return <div className="securities-error-message">{errorMessage}</div>;
};

export default ErrorMessage;
