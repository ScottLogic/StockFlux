import React from "react";
import "./ToolTip.css";
import PropTypes from "prop-types";

const ToolTip = ({ children, message }) => {
  return (
    <div className="tool-tip-container">
      {children}
      <span className="tool-tip-message">{message}</span>
    </div>
  );
};

ToolTip.propTypes = {
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.numberl,
    propTypes.symbol
  ])
};

export default ToolTip;
