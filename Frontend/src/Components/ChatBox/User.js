import React from "react";

const User = ({ imageUrl, onChatClick, name, index }) => {
  return (
    <button
      key={index}
      onClick={() => onChatClick(name)}
      className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
    >
      <img
        src={imageUrl}
        className="h-12 w-12 bg-indigo-200 rounded-full object-cover"
      />
      <div className="ml-3 mb-2 text-sm text-center font-semibold">{name}</div>
    </button>
  );
};

export default User;
