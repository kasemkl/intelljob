import React, { useEffect, useState } from "react";
import { MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
}

interface MessageListProps {
  senderId: string;
  recipientId: string;
}

const MessageList: React.FC<MessageListProps> = ({ senderId, recipientId }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8082/message/${senderId}/${recipientId}`)
      .then((response) => response.json())
      .then((data) => setMessages(data))
      .catch((error) => console.error("Error fetching messages:", error));
  }, [senderId, recipientId]);

  return (
    <MDBListGroup>
      {messages.map((message) => (
        <MDBListGroupItem key={message.id}>
          <strong>{message.senderId}:</strong> {message.content}
          <small>{new Date(message.timestamp).toLocaleString()}</small>
        </MDBListGroupItem>
      ))}
    </MDBListGroup>
  );
};

export default MessageList;
