import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import Input from "../../shared/components/FormElements/Input/Input";
import Conversation from "../components/Conversation/Conversation";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./Messenger.scss";
import ErrorModal from "../../shared/components/UIElements/ErrorModal/ErrorModal";

const Messenger = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/conversations/${auth.userId}`,
          "GET",
          null,
          {
            Authorization: auth.token,
          }
        );
        setConversations(responseData.conversations);
      } catch {}
    };
    fetchConversations();
  }, []);

  const conversationPickedHandler = (id) => {
    history.push(`/chat/${id}`);
  };

  const searchInputHandler = (id, val, isValid) => {};

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            {" "}
            <Input
              id="search"
              type="text"
              element="input"
              label="Search friends:"
              onInput={searchInputHandler}
              validators={[]}
            />
            {conversations &&
              conversations.map((conversaton) => (
                <Conversation
                  key={conversaton.id}
                  id={conversaton.id}
                  name={
                    conversaton.users.find((x) => x.id !== auth.userId).name
                  }
                  image={
                    conversaton.users.find((x) => x.id !== auth.userId).image
                  }
                  onClick={conversationPickedHandler}
                />
              ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Messenger;
