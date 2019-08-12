import React, { useState } from "react";
import "./Confirmation.css";
import Button from "./Button";

const Confirmation = ({ children, confirmationText, className, ...props }) => {
  const [clickedStatus, setClickedStatus] = useState(false);

  return (
    <div
      {...props}
      className={`confirmation-button-container ${className ? className : ""}`}
    >
      {!clickedStatus ? (
        <div
          {...props}
          onClickCapture={event => {
            event.stopPropagation();
            setClickedStatus(true);
          }}
        >
          {children}
        </div>
      ) : (
        <>
          <div className="confirmation-message-container">
            {confirmationText}
          </div>
          <div className="confirmation-option-button-container">
            <Button
              text="Yes"
              size="extra-small"
              onClick={children.props.onClick}
              className="confirmation-option-button"
              type="button"
            />
            <Button
              text="No"
              size="extra-small"
              onClick={() => setClickedStatus(false)}
              className="confirmation-option-button"
              type="button"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Confirmation;
