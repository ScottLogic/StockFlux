import React from "react";
import "./Message.css";

const Message = ({ message, type }) => {
  return <div className={`securities-message ${type}`}>{message}</div>;
};

export default Message;
