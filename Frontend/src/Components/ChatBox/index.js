import React, { useEffect, useRef } from "react";
import Loader from "../Loader";
import ChatContent, { EmptyChat } from "./ChatContent";
import Sidebar from "./SideBar";

const Chat = ({
  user,
  users,
  onSend,
  openChat,
  onChange,
  newMessage,
  allMessages,
  onChatClick,
  totalMessages,
  messgaeRefIndex,
  loadMoreMessages,
  getMessagesLoading,
  messageNotification,
  sendingMessageloading,
}) => {
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages, messgaeRefIndex]);

  return (
    <div className="flex h-[90vh] antialiased text-gray-800">
      <div className="flex flex-row h-full w-full">
        {/* Sidebar */}
        <Sidebar
          users={users}
          onChatClick={onChatClick}
          messageNotification={messageNotification}
          openChat={openChat}
        />

        {/* Chat content or loader */}
        {getMessagesLoading || sendingMessageloading ? (
          <Loader />
        ) : (
          <>
            {openChat ? (
              <ChatContent
                allMessages={allMessages}
                messgaeRefIndex={messgaeRefIndex}
                lastMessageRef={lastMessageRef}
                totalMessages={totalMessages}
                loadMoreMessages={loadMoreMessages}
                user={user}
                users={users}
                getMessagesLoading={getMessagesLoading}
                sendingMessageloading={sendingMessageloading}
                newMessage={newMessage}
                onSend={onSend}
                onChange={onChange}
                openChat={openChat}
              />
            ) : (
              <EmptyChat />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
