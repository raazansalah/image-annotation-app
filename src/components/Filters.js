import React from "react";

import { useState } from "react";

const Filters = ({ onSelect, selectedFilter }) => {
  const filters = ["Pending", "In Progress", "Completed"];

  return (
    <div className="flex space-x-4 py-2 justify-center gap-8 mb-6">
      {filters.map((item, index) => (
        <div
          key={index}
          onClick={() => onSelect(item)}
          className={`cursor-pointer px-4 py-2 rounded-lg text-center transition-all duration-300 
            ${
              selectedFilter === item
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }
            hover:bg-blue-600 hover:text-white`}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default Filters;
