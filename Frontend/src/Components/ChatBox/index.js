import React from "react";
import Input from "./Input";
import Message from "./Message";
import User from "./User";

const Chat = ({
  user,
  users,
  onSend,
  onChange,
  onChatClick,
  openChat,
  allMessages,
  newMessage,
  messageNotification,
}) => {
  return (
    <div className="flex h-[90vh] antialiased text-gray-800">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <div className="flex flex-col py-8 pl-2 pr-2 w-64 bg-gray-100 flex-shrink-0 rounded-xl">
          <div className="flex flex-row items-center h-12 w-full">
            <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                ></path>
              </svg>
            </div>
            <div className="ml-2 font-bold text-2xl">QuickChat</div>
          </div>
          <div className="flex flex-col mt-8 overflow-hidden">
            <div className="flex flex-col -mx-2 h-full overflow-y-auto">
              {users.map((el, index) => {
                let latestMessage, tempLatestMessage;
                latestMessage = messageNotification.find(
                  (msg) => msg.from == el.email
                );
                if (!latestMessage) {
                  tempLatestMessage = allMessages
                    .reverse()
                    .find((msg) => msg.from == el.email);
                }

                return (
                  <User
                    key={index}
                    bold={latestMessage ? true : false}
                    email={el.email}
                    imageUrl={el.imageUrl}
                    onChatClick={onChatClick}
                    name={el.name}
                    latestMessage={
                      latestMessage
                        ? latestMessage
                        : allMessages[allMessages.length - 1]
                    }
                  />
                );
              })}
            </div>
          </div>
        </div>
        {openChat ? (
          <div className="flex flex-col flex-auto h-full p-6">
            <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
              <div className="flex flex-col h-full overflow-x-auto mb-4">
                <div className="flex flex-col h-full">
                  {allMessages.map((el, index) => {
                    let otherUser = users.find((us) => el.from == us.email);
                    return (
                      <div key={index}>
                        <Message
                          imageUrl={
                            otherUser ? otherUser?.imageUrl : user?.imageUrl
                          }
                          message={el.content}
                          direction={otherUser ? "left" : "right"}
                          name={otherUser ? otherUser?.name : user?.name}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <Input
                newMessage={newMessage}
                onSend={onSend}
                onChange={onChange}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-auto h-full p-6">
            <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
              <div className="relative mr-3 text-sm text-center mb-5 bg-gray-200 py-2 px-4 font-bold shadow rounded-xl">
                <div>Chat with your friends</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
