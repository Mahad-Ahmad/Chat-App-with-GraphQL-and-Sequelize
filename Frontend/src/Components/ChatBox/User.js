import React from "react";

const User = ({ imageUrl, onChatClick, name, index, email, latestMessage }) => {
  return (
    <>
      <button
        key={index}
        onClick={() => onChatClick(email)}
        className="flex flex-row items-center hover:bg-gray-200 rounded-3xl ml-2 my-1"
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
              <div className="text-xs text-center font-light text-gray-400">
                {latestMessage.content}
              </div>
            </>
          ) : (
            <div className="text-xs text-center font-light text-gray-400">
              You are connected
            </div>
          )}
        </div>
      </button>
    </>
  );
};

export default User;
