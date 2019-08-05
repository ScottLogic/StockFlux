import React from "react";
import { Link } from "react-router-dom";
import "./AddSecurityButton.css";
import Button from "./Button";

const AddSecuritiesButton = ({ size }) => {
  return (
    <Link to="/inputform">
      <Button
        text="Add Security"
        size={size}
        className="add-securities-button"
      />
    </Link>
  );
};

export default AddSecuritiesButton;
