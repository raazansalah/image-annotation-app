"use client";

import React, { useState } from "react";
import Canvas from "@/app/canvas";

const Home = () => {
  const [imageSrc, setImageSrc] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Image Annotation Tool</h1>

      {/* Image Upload Section */}
      <input type="file" onChange={handleImageUpload} className="mt-4" />

      <Canvas imageSrc={imageSrc} />
    </div>
  );
};

export default Home;
