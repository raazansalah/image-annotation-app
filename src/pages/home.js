"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Canvas from "@/components/canvas";
import { db } from "../../firebase";
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

const Home = () => {
  const [annotations, setAnnotations] = useState();
  const [currentAnnotation, setCurrentAnnotation] = useState(null);

  const router = useRouter();
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
    try {
      await updateTask(newAnnotation?.id, newAnnotation);
      console.log("Annotations updated successfully!");
    } catch (error) {
      console.error("Error updating annotations:", error);
    }
  };

  const fetchData = async () => {
    try {
      const tasksQuery = query(
        collection(db, "tasks"),
        where("assignedTo", "==", userId)
      );
      const querySnapshot = await getDocs(tasksQuery);

      const items = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setAnnotations(items);
    } catch (error) {
      console.error("Error fetching tasks: ", error);
    }
  };

  const updateTask = async (firestoreId, updatedData) => {
    try {
      const taskDocRef = doc(db, "tasks", firestoreId);
      await updateDoc(taskDocRef, updatedData);
      fetchData();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        Image Annotation Tool
      </h1>

      {/* Image Upload and Selection Section */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        {annotations?.map((annotation) => (
          <div
            key={annotation.taskId}
            onClick={() => {
              setCurrentAnnotation(annotation);
            }}
            className="cursor-pointer transform transition-all hover:scale-105"
          >
            <img
              src={annotation.imageURL}
              alt="image"
              className="w-24 h-12 object-cover rounded-md shadow-md"
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
        onFinish={handleAnnotationFinish}
        currentAnnotation={currentAnnotation}
      />
    </div>
  );
};

export default Home;
