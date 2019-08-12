import React from "react";
import "./Button.css";
import PropTypes from "prop-types";

const Button = ({ text, size, className, ...props }) => {
  return (
    <button
      className={`button-container ${size} ${className ? className : ""}`}
      {...props}
    >
      {text}
    </button>
  );
};

Button.propTypes = {
  size: PropTypes.oneOf(["extra-small", "small", "large"]).isRequired,
  className: PropTypes.string
};

export default Button;
