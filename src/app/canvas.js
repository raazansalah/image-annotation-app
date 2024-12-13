"use client"; // Ensure this is a client-side component

import React, { useRef, useState, useEffect } from "react";

const Canvas = ({ imageSrc }) => {
  const canvasRef = useRef(null);
  const canvasContext = useRef(null);

  const [rectangles, setRectangles] = useState([]);
  const [drawingParams, setDrawingParams] = useState({
    x: 0,
    y: 0,
  });

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

        // Draw existing rectangles with annotations
        if (rectangles.length) {
          rectangles.forEach(({ x, y, width, height, text }) => {
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "red";
            ctx.stroke();
            ctx.font = "14px Arial";
            ctx.fillStyle = "red";
            ctx.fillText(text, x + 5, y + 15);
          });
        }
      };
    }
  }, [imageSrc, rectangles]);

  const handleMouseDown = ({ clientX, clientY }) => {
    const canvas = canvasRef.current;
    const { top, left } = canvas.getBoundingClientRect();
    setDrawingParams({
      x: clientX - top,
      y: clientY - left,
    });
  };

  const handleMouseUp = ({ clientX, clientY }) => {
    const canvas = canvasRef.current;
    const { top, left } = canvas.getBoundingClientRect();
    const { x: startX, y: startY } = drawingParams;
    //specify width and height of rectangle when mouse is up
    const width = clientX - left - startX;
    const height = clientY - top - startY;

    setRectangles((prev) => [
      ...prev,
      {
        x: startX,
        y: startY,
        width,
        height,
      },
    ]);
  };

  console.log(rectangles);
  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default Canvas;
