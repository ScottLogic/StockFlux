import React from 'react';
import './ToolTip.css';
import PropTypes from 'prop-types';

const ToolTip = ({ children, text }) => (
  <div className="tool-tip">
    {children}
    <span className="message">{text}</span>
  </div>
);

ToolTip.propTypes = {
  message: PropTypes.string
};

export default ToolTip;
