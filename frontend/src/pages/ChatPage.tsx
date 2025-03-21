import React, { useState, useEffect ,useContext} from "react";
import ConversationList from "../components/ConversationList";
import MessageList from "../components/MessageList";
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { AuthContext } from "../contexts/AuthContext";

const ChatPage: React.FC = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const auth = useContext(AuthContext);
  // if (!auth) return null;

  const { user, logoutUser } = auth || {};
  const userId = user?.user_id ?? ""; // Replace with the actual user ID
console.log('usseeeeeeeeeeer',user)
  useEffect(() => {

    const socket = new SockJS("http://localhost:8082/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log("Connected to WebSocket");

      stompClient.subscribe(`/user/${userId}/queue/messages`, (response) => {
        const message = JSON.parse(response.body);
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    });

    return () => {
      stompClient.disconnect(() => {
        console.log("Disconnected from WebSocket");
      });
    };
  }, [userId]);

  const sendMessage = (content: string, recipientId: string) => {
    const stompClient = Stomp.over(new SockJS("http://localhost:8082/ws"));

    stompClient.connect({}, () => {
      stompClient.send(
        "/app/chat",
        {},
        JSON.stringify({
          senderId: userId,
          recipientId: recipientId,
          content: content,
        })
      );
    });
  };

  return (
    <MDBContainer>
      <MDBRow>
        <MDBCol md="4">
          <ConversationList
            userId={userId.toString()}
            onConversationSelect={setSelectedConversationId}
          />
        </MDBCol>
        <MDBCol md="8">
          {selectedConversationId && (
            <>
              <MessageList
                senderId={userId.toString()}
                recipientId={selectedConversationId}
              />
              <input
                type="text"
                placeholder="Type your message"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    sendMessage(e.currentTarget.value, selectedConversationId);
                    e.currentTarget.value = "";
                  }
                }}
              />
            </>
          )}
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default ChatPage;
