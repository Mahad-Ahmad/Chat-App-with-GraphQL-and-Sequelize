import React from "react";

const Label = ({ errors, errorColor, labelText }) => {
  return (
    <label
      htmlFor={labelText}
      className={`block mb-2 text-sm font-medium ${
        errors ? errorColor : "text-gray-900 dark:text-white"
      }`}
    >
      {errors ?? labelText}
    </label>
  );
};

export default Label;
