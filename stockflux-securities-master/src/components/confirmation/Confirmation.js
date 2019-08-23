import React, { useState } from "react";
import "./Confirmation.css";
import Button, { ButtonSize } from "../button/Button";
import PropTypes from "prop-types";

const Confirmation = ({ children, confirmationText }) => {
  const [clickedStatus, setClickedStatus] = useState(false);
  const handleClickNoButton = () => {
    setClickedStatus(false);
  };

  return (
    <div className="confirmation">
      {!clickedStatus ? (
        <div
          onClickCapture={event => {
            event.stopPropagation();
            setClickedStatus(true);
          }}
        >
          {children}
        </div>
      ) : (
        <>
          <div className="message">{confirmationText}</div>
          <div className="options-container">
            <Button
              size={ButtonSize.EXTRA_SMALL}
              onClick={children.props.onClick}
              className="option-button"
              type="button"
            >
              Yes
            </Button>
            <Button
              size={ButtonSize.EXTRA_SMALL}
              onClick={handleClickNoButton}
              className="option-button"
              type="button"
            >
              No
            </Button>
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
