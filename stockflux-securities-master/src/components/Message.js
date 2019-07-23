import React from "react";
import "./Message.css";

const Message = ({ message, type }) => {
  return <div className={`securities-${type}-message`}>{message}</div>;
};

export default Message;
