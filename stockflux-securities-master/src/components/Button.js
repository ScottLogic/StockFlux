import React from "react";
import "./Button.css";
import PropTypes from "prop-types";

const Button = ({ text, size, className, ...props }) => {
  return (
    <div className={`button-container ${size} ${className}`}>
      <button {...props}>{text}</button>
    </div>
  );
};

Button.propTypes = {
  size: PropTypes.oneOf(["extraSmall", "small", "large"]).isRequired,
  className: PropTypes.string
};

export default Button;
