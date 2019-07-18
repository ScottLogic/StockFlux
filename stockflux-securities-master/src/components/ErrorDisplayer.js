import React from "react";
import "./ErrorDisplayer.css";

const ErrorDisplayer = ({ errorMessage }) => {
  return (
    <div className="securities-error-message">{errorMessage}</div>
  );
};

export default ErrorDisplayer;
