import React, { useEffect, useState } from "react";
import "./Alert.css";

const Alert = ({ messages, type, className }) => {
  const [messagesArray, setMessagesArray] = useState([]);

  useEffect(() => {
    typeof messages === "string"
      ? setMessagesArray([messages])
      : setMessagesArray(messages);
  }, []);

  return (
    <ul className={`securities-alert-container ${className}`}>
      {messagesArray.map((message, index) => {
        return (
          <li className={`securities-alert ${type}`} key={index}>
            {message}
          </li>
        );
      })}
    </ul>
  );
};

export default Alert;
