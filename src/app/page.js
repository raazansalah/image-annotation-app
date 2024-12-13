"use client";
import React, { useState } from "react";

import Canvas from "@/app/canvas";

const Home = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [imageUrl, setImageUrl] = useState(""); // To store the download URL

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => setImageSrc(reader.result);

      const url = await uploadToCloudinary(file);
      if (url) {
        setImageSrc(url);
      }
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "innotation-preset"); // Replace with your preset name

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dtxpyz1zf/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url; // This is the URL of the uploaded image
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return null;
    }
  };

  const handleAnnotationFinish = (imageUrl, rectangles) => {
    setAnnotations((prev) => {
      const existingEntry = prev.find((annotation) => annotation[imageUrl]);

      if (existingEntry) {
        // If the image exists, update its rectangles
        return prev.map((annotation) =>
          annotation[imageUrl] ? { [imageUrl]: rectangles } : annotation
        );
      } else {
        return [...prev, { [imageUrl]: rectangles }];
      }
    });
  };
  console.log(annotations);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Image Annotation Tool</h1>

      {/* Image Upload Section */}
      <input type="file" onChange={handleImageUpload} className="mt-4" />

      <Canvas imageSrc={imageSrc} onFinish={handleAnnotationFinish} />
    </div>
  );
};

export default Home;
