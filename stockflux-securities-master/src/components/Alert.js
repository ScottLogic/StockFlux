import React, { useEffect, useState } from "react";
import "./Alert.css";

const Alert = ({ messages, type }) => {
  const [messagesArray, setMessagesArray] = useState([]);

  useEffect(() => {
    typeof messages === "string"
      ? setMessagesArray([messages])
      : setMessagesArray(messages);
  }, []);

  return (
    <ul>
      {messagesArray.map((message, index) => {
        return (
          <li key={index}>
            <div className={`securities-message ${type}`}>{message}</div>
          </li>
        );
      })}
    </ul>
  );
};

export default Alert;
