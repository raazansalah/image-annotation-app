import React from "react";

const Input = ({ id, label, type, value, onChange, placeholder }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 mt-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
        required
      />
    </div>
  );
};

export default Input;
