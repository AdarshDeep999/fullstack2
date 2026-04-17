import { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const clientRef = useRef(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("Connected ✅");

        client.subscribe("/topic/messages", (msg) => {
          const data = JSON.parse(msg.body);
          setMessages((prev) => [...prev, data]);
        });
      },

      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => client.deactivate();
  }, []);

  const sendMessage = (text) => {
    if (!username) {
      alert("Enter username first");
      return;
    }

    if (clientRef.current) {
      clientRef.current.publish({
        destination: "/app/chat",
        body: JSON.stringify({
          sender: username,
          content: text,
        }),
      });
    }
  };

  return (
    <div className="chat-box">
      <input
        className="username"
        placeholder="Enter name"
        onChange={(e) => setUsername(e.target.value)}
      />

      <MessageList messages={messages} />
      <MessageInput sendMessage={sendMessage} />
    </div>
  );
}

export default Chat;