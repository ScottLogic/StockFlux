import React, { useState } from "react";
import "./ConfirmationButton.css";
import Button from "./Button";

const ConfirmationButton = ({
  text,
  confirmationText,
  size,
  onClick,
  className,
  ...props
}) => {
  const [clickedStatus, setClickedStatus] = useState(false);
  
  return (
    <div className={`confirmation-button-container ${className}`}>
      {!clickedStatus ? (
        <Button
          {...props}
          onClick={() => setClickedStatus(true)}
          text={text}
          size={size}
        />
      ) : (
        <>
          <div className="confirmation-message-container">
            {confirmationText}
          </div>
          <div className="yes-no-button-container">
            <Button
            {...props}
              text="Yes"
              size="extraSmall"
              onClick={onClick}
              className="yes-button"
              type="button"
            />
            <Button
              text="No"
              size="extraSmall"
              onClick={() => setClickedStatus(false)}
              className="no-button"
              type="button"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ConfirmationButton;
