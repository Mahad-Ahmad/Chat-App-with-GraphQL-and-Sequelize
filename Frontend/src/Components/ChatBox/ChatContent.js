import React from "react";
import Input from "./Input";
import Message from "./Message";

const ChatContent = ({
  allMessages,
  messgaeRefIndex,
  lastMessageRef,
  totalMessages,
  loadMoreMessages,
  user,
  users,
  getMessagesLoading,
  sendingMessageloading,
  newMessage,
  onSend,
  onChange,
  openChat,
}) => (
  <div className="flex flex-col flex-auto h-full px-6 pb-6 pt-8">
    <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
      <div className="hide-scroll-bar flex flex-col h-full overflow-x-auto mb-4">
        {/* Load more messages button */}
        {totalMessages > 10 && allMessages.length !== totalMessages && (
          <div
            onClick={loadMoreMessages}
            className="flex justify-center bg-gray-200 rounded-xl px-10 py-1 cursor-pointer text-gray-500 text-center"
          >
            Load more messages
          </div>
        )}

        {/* Messages */}
        <div className="flex flex-col h-full">
          {allMessages.map((message, index) => {
            const otherUser = users.find((user) => message.from === user.email);
            const isLastMessage =
              (messgaeRefIndex && index === messgaeRefIndex) ||
              (!messgaeRefIndex && index === allMessages.length - 1);

            return (
              <div
                ref={isLastMessage ? lastMessageRef : null}
                id={isLastMessage ? "lastMessage" : ""}
                key={index}
              >
                <Message
                  imageUrl={otherUser ? otherUser.imageUrl : user?.imageUrl}
                  message={message.content}
                  direction={otherUser ? "left" : "right"}
                  name={otherUser ? otherUser.name : user?.name}
                />
              </div>
            );
          })}
        </div>
      </div>
      {/* Input component */}
      <Input newMessage={newMessage} onSend={onSend} onChange={onChange} />
    </div>
  </div>
);

export const EmptyChat = () => (
  <div className="flex flex-col flex-auto h-full p-6">
    <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
      <div className="relative mr-3 text-sm text-center mb-5 bg-gray-200 py-2 px-4 font-bold shadow rounded-xl">
        <div>Chat with your friends</div>
      </div>
    </div>
  </div>
);

export default ChatContent;
