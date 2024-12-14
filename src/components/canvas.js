"use client"; // Ensure this is a client-side component

import React, { useRef, useState, useEffect } from "react";

const Canvas = ({ onFinish, currentAnnotation }) => {
  const canvasRef = useRef(null);
  const canvasContext = useRef(null);

  const [rectangles, setRectangles] = useState(currentAnnotation?.annotations);
  const [textValue, setTextValue] = useState("");
  const [drawingParams, setDrawingParams] = useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    isDrawing: false,
  });
  console.log(currentAnnotation);
  useEffect(() => {
    if (currentAnnotation) setRectangles(currentAnnotation?.annotations);
  }, [currentAnnotation]);

  // Load the image and set up canvas context
  useEffect(() => {
    if (currentAnnotation?.imageURL) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvasContext.current = ctx;

      const img = new Image();
      img.src = currentAnnotation?.imageURL;
      img.onload = () => {
        // Clear and Draw the image onto the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Draw existing rectangles with annotations
        if (rectangles && rectangles.length) {
          rectangles.forEach(({ x, y, width, height, annotation = "" }) => {
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "red";
            ctx.stroke();
            ctx.font = "14px Arial";
            ctx.fillStyle = "red";
            ctx.fillText(annotation, x + 5, y + 15);
          });
        }
      };
    }
  }, [currentAnnotation, rectangles]);

  const handleMouseDown = ({ clientX, clientY }) => {
    const canvas = canvasRef.current;
    const { top, left } = canvas.getBoundingClientRect();

    setDrawingParams({
      isDrawing: true,
      startX: clientX - left,
      startY: clientY - top,
    });
  };

  const handleMouseUp = () => {
    const { startX, startY, endX, endY } = drawingParams;
    //specify width and height of rectangle when mouse is up
    const width = endX - startX;
    const height = endY - startY;

    setRectangles((prev) => [
      ...prev,
      {
        x: startX,
        y: startY,
        width,
        height,
        annotation: textValue,
      },
    ]);
    setTextValue("");
    onFinish(currentAnnotation.taskId, rectangles);
  };

  //updating drawing parameters while dragging
  const handleMouseMove = ({ clientX, clientY }) => {
    if (drawingParams.isDrawing) {
      const canvas = canvasRef.current;
      const { top, left } = canvas.getBoundingClientRect();

      setDrawingParams((prev) => {
        return {
          ...prev,
          endX: clientX - left,
          endY: clientY - top,
        };
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      {/* Canvas container */}
      <div className="relative w-full max-w-4xl">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-auto border-2 border-gray-300 rounded-lg shadow-md"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        />
      </div>

      {/* Annotation input field */}
      <div className="w-full max-w-md">
        <input
          type="text"
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder="Enter annotation text"
          className="w-full p-4 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 text-black"
        />
      </div>
    </div>
  );
};

export default Canvas;
