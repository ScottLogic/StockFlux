import React from "react";
import "./ToolTip.css";
import PropTypes from "prop-types";

const ToolTip = ({ children, message, className }) => {
  return (
    <div className={`tool-tip-container ${className ? className : ""}`}>
      {children}
      <span className="tool-tip-message">{message}</span>
    </div>
  );
};

ToolTip.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string
};

export default ToolTip;
