import React, { useState } from 'react';
import './Confirmation.css';
import PropTypes from 'prop-types';

const Confirmation = ({ children, confirmationText }) => {
  const [isClicked, setIsClicked] = useState(false);

  const resetIsClicked = () => {
    setIsClicked(false);
  };

  return (
    <div className="confirmation">
      {!isClicked ? (
        <div
          onClickCapture={event => {
            event.stopPropagation();
            setIsClicked(true);
          }}
        >
          {children}
        </div>
      ) : (
        <>
          <div className="message">{confirmationText}</div>
          <div className="option-buttons">
            <button
              onClick={children.props.onClick}
              className="option-yes"
              type="button"
            >
              YES
            </button>
            <button
              onClick={resetIsClicked}
              className="option-no"
              type="button"
            >
              NO
            </button>
          </div>
        </>
      )}
    </div>
  );
};

Confirmation.propTypes = {
  confirmationText: PropTypes.string.isRequired
};

export default Confirmation;
