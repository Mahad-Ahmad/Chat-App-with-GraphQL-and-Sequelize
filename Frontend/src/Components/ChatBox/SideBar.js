import React from "react";
import User from "./User";

const Sidebar = ({ users, onChatClick, messageNotification, openChat }) => (
  <div className="flex flex-col py-8 pl-2 pr-2 w-64 mt-8 bg-gray-100 flex-shrink-0 rounded-xl">
    <div className="flex flex-row items-center h-12 w-full">
      {/* Sidebar header */}
      <div className="flex items-center justify-center rounded-2xl h-10 w-10">
        <img
        //   width="50"
        //   height="50"
          src="https://img.icons8.com/ios-filled/50/chat-message--v1.png"
          alt="chat-message-icon"
        />
      </div>
      <div className="ml-2 font-bold text-2xl">Chats</div>
    </div>

    {/* User list */}
    <div className="flex flex-col mt-8 overflow-hidden">
      <div className="flex flex-col -mx-2 h-full overflow-y-auto hide-scroll-bar">
        {users.map((user, index) => (
          <User
            key={index}
            selectedChat={openChat === user.email}
            bold={messageNotification.some((msg) => msg.from === user.email)}
            email={user.email}
            imageUrl={user.imageUrl}
            onChatClick={onChatClick}
            name={user.name}
            latestMessage={user.latestMessage}
          />
        ))}
      </div>
    </div>
  </div>
);

export default Sidebar;
