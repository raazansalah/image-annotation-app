"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import useAuth from "@/hooks/auth";
import { addNewTask, getTasks, updateTask } from "@/api/tasks";

import Canvas from "@/components/canvas";
import Filters from "@/components/Filters";
import { auth } from "../../firebase";

const Home = () => {
  const [annotations, setAnnotations] = useState([]);
  const [currentAnnotation, setCurrentAnnotation] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);

  const router = useRouter();
  const user = useAuth();

  const { userId } = router.query;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      const url = await uploadToCloudinary(file);
      if (url) {
        setCurrentAnnotation({ imageURL: url, annotations: [] });
      }
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "innotation-preset");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dtxpyz1zf/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return null;
    }
  };

  const handleAnnotationFinish = async (newAnnotation) => {
    if (newAnnotation.id) {
      await updateTask(newAnnotation?.id, newAnnotation);
      handleGetTasksList();
    } else {
      await addNewTask({
        ...newAnnotation,
        assignedTo: userId,
        status: "Completed",
      });
    }
  };

  const handleGetTasksList = async () => {
    const items = await getTasks(userId, selectedFilter);
    setAnnotations(items);
    // setCurrentAnnotation({ ...items[0], index: 0 });
  };

  const handleTasksNavigation = (index) => {
    setCurrentAnnotation({ ...annotations[index], index });
  };

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
  };

  useEffect(() => {
    if (user && userId) handleGetTasksList();
    else router.push("/auth");
  }, [userId, selectedFilter, user]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        Image Annotation Tool
      </h1>

      <Filters selectedFilter={selectedFilter} onSelect={handleFilterClick} />
      {/* Image Upload and Selection Section */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        {annotations?.map((annotation, index) => (
          <div
            key={annotation.id}
            onClick={() => {
              setCurrentAnnotation({ ...annotation, index });
            }}
            className="cursor-pointer transform transition-all hover:scale-105"
          >
            <Image
              src={annotation?.imageURL}
              alt="image"
              width={96}
              height={48}
              className="object-cover rounded-md shadow-md"
              quality={75}
            />
          </div>
        ))}
      </div>

      {/* Image Upload Input */}
      <div className="flex justify-center mb-6">
        <input
          type="file"
          onChange={handleImageUpload}
          className="file:border-2 file:border-gray-300 file:rounded-lg file:px-4 file:py-2 file:bg-gray-100 file:text-black file:cursor-pointer hover:file:bg-gray-200 transition-all"
        />
      </div>

      {/* Canvas Section */}
      <Canvas
        tasksLength={annotations.length}
        onFinish={handleAnnotationFinish}
        currentAnnotation={currentAnnotation}
        onNavigation={handleTasksNavigation}
      />
    </div>
  );
};

export default Home;
