import React, { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Message from "../components/Message/Message";
import Button from "../../shared/components/FormElements/Button/Button";
import Input from "../../shared/components/FormElements/Input/Input";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";
import { useParams } from "react-router-dom";

const Chat = () => {
  const conversationId = useParams().conversationId;
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    const fetchCurrentConversation = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +
            `/conversations/conversation/${conversationId}`,
          "GET",
          null,
          {
            Authorization: auth.token,
          }
        );

        setCurrentConversation(responseData.conversation);
      } catch {}
    };
    fetchCurrentConversation();
  }, [conversationId]);

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SOCKET);
    socket.current.on("getMessage", (data) => {
      const fetchSender = async () => {
        try {
          const responseData = await sendRequest(
            process.env.REACT_APP_BACKEND_URL + `/users/${data.senderId}`,
            "GET",
            null,
            {
              Authorization: auth.token,
            }
          );
          setArrivalMessage({
            sender: responseData.user,
            text: data.text,
            createdAt: Date.now(),
          });
        } catch {}
      };
      fetchSender();
    });
  }, []);

  useEffect(() => {
    socket.current.emit("addUser", auth.userId);
    socket.current.on("getUsers", (users) => {});
  }, [auth.userId]);

  useEffect(() => {
    arrivalMessage &&
      currentConversation?.users.find(
        (u) => u.id === arrivalMessage.sender.id
      ) &&
      setMessages((prevState) => [...prevState, arrivalMessage]);
  }, [arrivalMessage, currentConversation]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +
            `/messages/${currentConversation.id}`,
          "GET",
          null,
          {
            Authorization: auth.token,
          }
        );
        setMessages(responseData.messages);
      } catch {}
    };
    fetchMessages();
  }, [currentConversation]);

  const sendMessageHandler = async (event) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/messages`,
        "POST",
        JSON.stringify({
          conversation: currentConversation.id,
          sender: auth.userId,
          text: newMessage,
        }),
        {
          "Content-Type": "application/json",
          Authorization: auth.token,
        }
      );
      socket.current.emit("sendMessage", {
        senderId: auth.userId,
        receiver: currentConversation.users.find(
          (user) => user.id !== auth.userId
        ),
        text: newMessage,
      });
      setMessages((prevState) => [...prevState, responseData.message]);
      setNewMessage("");
    } catch {}
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chatBox">
      <ErrorModal error={error} onClear={clearError} />
      <div className="chatBoxWrapper">
        {currentConversation ? (
          <>
            <div className="chatBoxTop">
              {messages &&
                messages.map((message) => (
                  <div ref={scrollRef} key={message.id}>
                    <Message
                      own={message.sender.id === auth.userId}
                      image={message.sender.image}
                      text={message.text}
                      createdAt={message.createdAt}
                    />
                  </div>
                ))}
            </div>
            <div className="chatBoxBottom">
              <Input
                id="message"
                type="text"
                element="textarea"
                label="Write something:"
                onInput={(id, value, isValid) => setNewMessage(value)}
                validators={[]}
              />
              <Button type="button" onClick={sendMessageHandler}>
                SEND
              </Button>
            </div>
          </>
        ) : (
          <LoadingSpinner asOverlay />
        )}
      </div>
    </div>
  );
};

export default Chat;
