import React from "react";

const User = ({
  name,
  bold,
  index,
  email,
  imageUrl,
  onChatClick,
  selectedChat,
  latestMessage,
}) => {
  return (
    <>
      <button
        key={index}
        onClick={() => onChatClick(email)}
        className={`flex flex-row items-center hover:bg-gray-200 rounded-3xl mx-2 my-1 ${
          selectedChat ? "border-[5px]" : ""
        }`}
      >
        <img
          src={imageUrl}
          className="h-12 w-12 bg-indigo-200 rounded-full object-cover"
        />
        <div className="ml-3 text-start mb-2 text-sm font-semibold">
          {name}
          {latestMessage ? (
            <>
              <br />
              <div
                className={`text-xs text-start ${
                  bold ? "font-bold text-gray-900" : "font-light text-gray-400"
                }`}
              >
                {latestMessage.content}
              </div>
            </>
          ) : (
            <div className="text-xs text-start font-light text-gray-400">
              You are connected
            </div>
          )}
        </div>
      </button>
    </>
  );
};

export default User;
