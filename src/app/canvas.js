// components/Canvas.js
"use client"; // Ensure this is a client-side component

import React, { useRef, useState, useEffect } from "react";

const Canvas = ({ imageSrc }) => {
  const canvasRef = useRef(null);

  const canvasContext = useRef(null);

  // Load the image and set up canvas context
  useEffect(() => {
    if (imageSrc) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvasContext.current = ctx;

      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        // Set canvas size to match image size
        canvas.width = img.width;
        canvas.height = img.height;

        // Clear and Draw the image onto the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
  }, [imageSrc]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={800} height={600} className="border" />
    </div>
  );
};

export default Canvas;
