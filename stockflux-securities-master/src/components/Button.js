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

const Button = ({ text, size, className, type, onClick }) => (
  <button
    type={type || "submit"}
    className={`button-container ${size.valueOf()} ${className}`}
    onClick={onClick}
  >
    {text}
  </button>
);

Button.propTypes = {
  size: PropTypes.instanceOf(ButtonSize).isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default Button;
