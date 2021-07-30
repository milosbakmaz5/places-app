import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import "./Conversation.scss";

const Conversation = ({ id, name, image, onClick }) => {
  return (
    <div className="conversation" onClick={() => onClick(id)}>
      <img
        className="conversationImage"
        src={`${process.env.REACT_APP_ASSET_URL}/${image}`}
        alt="img"
      />
      <span className="conversationName">{name}</span>
    </div>
  );
};

export default Conversation;
