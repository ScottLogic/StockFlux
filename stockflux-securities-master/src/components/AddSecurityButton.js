import React from "react";
import { Link } from "react-router-dom";
import "./AddSecurityButton.css";

const AddSecuritiesButton = ({ size }) => {
  return (
    <Link to="/inputform">
      <div className={`add-security-button-${size}`}>
        <button>Add a security</button>
      </div>
    </Link>
  );
};

export default AddSecuritiesButton;
