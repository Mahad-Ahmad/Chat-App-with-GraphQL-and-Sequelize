import React from "react";
import UserImage from "./UserImage";

const Message = ({ imageUrl, message, direction, name }) => {
  return (
    <div className="grid grid-cols-12 gap-y-2">
      {direction == "left" && (
        <div className="col-start-1 col-end-8 p-3 rounded-lg">
          <div className="flex flex-row items-center">
            <UserImage imageUrl={imageUrl} name={name} />
            <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow  rounded-xl">
              <div>{message}</div>
            </div>
          </div>
        </div>
      )}
      {direction == "right" && (
        <div className="col-start-6 col-end-13 p-3 rounded-lg">
          <div className="flex items-center justify-start flex-row-reverse">
            <UserImage imageUrl={imageUrl} name={name} />
            <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
              <div>{message}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
