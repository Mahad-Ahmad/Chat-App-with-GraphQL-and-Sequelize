import React from "react";

const UserImage = ({ imageUrl, name }) => {
  return (
    <>
      {imageUrl && (
        <img
          className="flex object-cover items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
          src={imageUrl}
          alt=""
        />
      )}
      {!imageUrl && name && (
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
          {name ? name.split("")[0] : ""}
        </div>
      )}
    </>
  );
};

export default UserImage;
