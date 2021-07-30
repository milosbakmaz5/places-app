import React from "react";
import { format } from "timeago.js";

import "./Message.scss";

const Message = ({ own, image, text, createdAt }) => {
  return (
    <div className={`message ${own ? "own" : ""}`}>
      <div className="messageTop">
        <img
          className="messageImage"
          src={`${process.env.REACT_APP_ASSET_URL}/${image}`}
          alt="img"
        />
        <p className="messageText">{text}</p>
      </div>
      <div className="messageBottom">{format(createdAt)}</div>
    </div>
  );
};

export default Message;
