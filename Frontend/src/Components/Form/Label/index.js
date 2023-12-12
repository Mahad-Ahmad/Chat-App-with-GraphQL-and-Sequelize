import React from "react";

const Label = ({ labelText }) => {
  return (
    <label
      htmlFor={labelText}
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      {labelText}
    </label>
  );
};

export default Label;
