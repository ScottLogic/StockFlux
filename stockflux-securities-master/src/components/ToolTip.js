import React from "react";
import "./ToolTip.css";

const ToolTip = ({ children, message }) => {
  return (
    <div className="tool-tip-container">
      {children}
      <span className="tool-tip-message">{message}</span>
    </div>
  );
};

export default ToolTip;
