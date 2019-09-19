import React from 'react';
import PropTypes from 'prop-types';
import ChildrenShape from '../../../shapes/Children';
import './RoundIcon.css';

const RoundIcon = ({ children, className, onClick }) => (
  <button
    className={className ? `round ${className}` : `round`}
    onClick={onClick}
  >
    {children}
  </button>
);

RoundIcon.propTypes = {
  children: ChildrenShape.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default RoundIcon;
