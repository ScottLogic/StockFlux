import React from 'react';
import PropTypes from 'prop-types';
import ChildrenShape from '../../shapes/Children';
import './ToolTip.css';

const ToolTip = ({ children, text }) => (
  <div className="tool-tip">
    {children}
    <span className="message">{text}</span>
  </div>
);

ToolTip.propTypes = {
  children: ChildrenShape.isRequired,
  text: PropTypes.string.isRequired
};

export default ToolTip;
