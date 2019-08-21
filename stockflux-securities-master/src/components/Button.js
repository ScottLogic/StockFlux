import React from "react";
import "./Button.css";
import PropTypes from "prop-types";

export function ButtonSize(value) {
  this._value = value;
}

ButtonSize.prototype.valueOf = function() {
  return this._value;
};

ButtonSize.EXTRA_SMALL = new ButtonSize("extra-small");
ButtonSize.SMALL = new ButtonSize("small");
ButtonSize.LARGE = new ButtonSize("large");

const Button = ({ children, size, className, type, onClick }) => (
  <button
    type={type || "submit"}
    className={`button-container ${size.valueOf()} ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

Button.propTypes = {
  type: PropTypes.string,
  size: PropTypes.oneOf([
    ButtonSize.EXTRA_SMALL,
    ButtonSize.SMALL,
    ButtonSize.LARGE
  ]).isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default Button;
