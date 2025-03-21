import React, { useEffect, useState } from "react";
import { MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";

interface Conversation {
  conversationId: string;
  senderId: string;
  recipientId: string;
  lastMessage: {
    senderId: string;
    content: string;
    timestamp: string;
  };
}

interface ConversationListProps {
  userId: string;
  onConversationSelect: (conversationId: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  userId,
  onConversationSelect,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8082/conversations/${userId}`)
      .then((response) => response.json())
      .then((data) => setConversations(data))
      .catch((error) => console.error("Error fetching conversations:", error));
  }, [userId]);

  return (
    <MDBListGroup>
      {conversations.map((conversation) => (
        <MDBListGroupItem
          key={conversation.conversationId}
          onClick={() => onConversationSelect(conversation.conversationId)}
        >
          <strong>{conversation.recipientId}</strong>
          <p>{conversation.lastMessage.content}</p>
          <small>
            {new Date(conversation.lastMessage.timestamp).toLocaleString()}
          </small>
        </MDBListGroupItem>
      ))}
    </MDBListGroup>
  );
};

export default ConversationList;
