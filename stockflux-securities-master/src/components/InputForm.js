import React from "react";
import { Link } from "react-router-dom";
import "./InputForm.css";

const InputForm = () => {
  return (
    <div className="input-form-container">
      <div className="back-button"><Link to="/home">back</Link></div>
      <div className="input-form-title">Input/edit</div>
    </div>
  );
};

export default InputForm;
