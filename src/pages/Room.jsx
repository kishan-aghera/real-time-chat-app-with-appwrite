import client, { databases } from "../appwrite_config";
import { useEffect, useState } from "react";
import {
  APPWRITE_DATABASE_ID,
  APPWRITE_MESSAGE_COLLECTION_ID,
} from "../constants";
import { ID, Query, Role, Permission } from "appwrite";
import { Trash2 } from "react-feather";
import Header from "../components/Header";
import useAuth from "../utils/useAuth";

const Room = () => {
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");
  const { user } = useAuth();

  const getMessages = async () => {
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_MESSAGE_COLLECTION_ID,
      [Query.orderDesc("$createdAt")]
    );
    setMessages(response.documents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      body: messageBody,
      user_id: user.$id,
      username: user.name,
    };

    const permissions = [Permission.write(Role.user(user.$id))];

    await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_MESSAGE_COLLECTION_ID,
      ID.unique(),
      payload,
      permissions
    );

    setMessageBody("");
  };

  useEffect(() => {
    getMessages();

    const unsubscribe = client.subscribe(
      `databases.${APPWRITE_DATABASE_ID}.collections.${APPWRITE_MESSAGE_COLLECTION_ID}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          setMessages((prev) => [response.payload, ...prev]);
        }

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          const updatedMessages = messages.filter(
            (message) => message.$id !== response.payload.$id
          );

          setMessages(updatedMessages);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [messages]);

  const deleteMessage = async (message_id) => {
    await databases.deleteDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_MESSAGE_COLLECTION_ID,
      message_id
    );
  };

  return (
    <main className="container">
      <Header />
      <div className="room--container">
        <form onSubmit={handleSubmit} id="message--form">
          <div>
            <textarea
              required
              maxLength={1000}
              placeholder="Say Something..."
              onChange={(e) => setMessageBody(e.target.value)}
              value={messageBody}
            ></textarea>
          </div>

          <div className="send-btn--wrapper">
            <input className="btn btn--secondary" type="submit" value="Send" />
          </div>
        </form>

        <div>
          {messages.map((message) => (
            <div key={message.$id} className="message--wrapper">
              <div className="message--header">
                <p>
                  {message?.username ? (
                    <span>{message?.username}</span>
                  ) : (
                    <span>Anonymous User</span>
                  )}

                  <small className="message-timestamp">
                    {new Date(message.$createdAt).toLocaleString()}
                  </small>
                </p>

                {message.$permissions.includes(
                  `delete(\"user:${user.$id}\")`
                ) && (
                  <Trash2
                    className="delete--btn"
                    onClick={() => deleteMessage(message.$id)}
                  />
                )}
              </div>

              <div className="message--body">
                <span>{message.body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Room;
