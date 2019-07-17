import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AddSecurityButton.css";

const AddSecuritiesButton = () => {
  return (
    <Link to="/inputform">
      <div className="add-security-button">
        <button>Click to add security</button>
      </div>
    </Link>
  );
};

export default AddSecuritiesButton;
