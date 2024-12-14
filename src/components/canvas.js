"use client"; // Ensure this is a client-side component

import React, { useRef, useState, useEffect } from "react";

const Canvas = ({ tasksLength, onFinish, currentAnnotation, onNavigation }) => {
  const canvasRef = useRef(null);
  const canvasContext = useRef(null);

  const [rectangles, setRectangles] = useState(currentAnnotation?.annotations);
  const [textValue, setTextValue] = useState("");
  const [error, setError] = useState("");
  const [drawingParams, setDrawingParams] = useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    isDrawing: false,
  });

  useEffect(() => {
    if (currentAnnotation) setRectangles(currentAnnotation?.annotations);
  }, [currentAnnotation]);

  // Load the image and set up canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvasContext.current = ctx;

    if (currentAnnotation?.imageURL) {
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
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    if (!currentAnnotation) return;
    const { startX, startY, endX, endY } = drawingParams;
    //specify width and height of rectangle when mouse is up
    const width = endX - startX;
    const height = endY - startY;

    if (!textValue) {
      setError("please Enter annotation text");
      return;
    }

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

  const handleFinishAnnotation = () => {
    onFinish({ ...currentAnnotation, annotations: rectangles });
  };

  const handleNextClick = () => {
    if (drawingParams.isDrawing) handleFinishAnnotation();
    onNavigation(currentAnnotation.index + 1);
  };

  const handlePrevClick = () => {
    if (drawingParams.isDrawing) handleFinishAnnotation();
    onNavigation(currentAnnotation.index - 1);
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      <div className="border-2 border-gray-300 rounded-lg shadow-md w-1/2 flex items-center flex-col">
        <canvas
          ref={canvasRef}
          className="max-w-full"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        />
      </div>

      <input
        type="text"
        value={textValue}
        onChange={(e) => {
          setTextValue(e.target.value);
          setError(null);
        }}
        placeholder="Enter annotation text"
        className="mt-6 left-5 p-6 border rounded text-black"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-4">
        <button
          className={`py-4 px-8 mt-4 bg-blue-500 text-white rounded-lg transition-all hover:bg-blue-600 ${
            !currentAnnotation || currentAnnotation.index === 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={!currentAnnotation || currentAnnotation.index === 0}
          onClick={handlePrevClick}
        >
          prev
        </button>
        <button
          className={`py-4 px-8 mt-4 bg-blue-500 text-white rounded-lg transition-all hover:bg-blue-600 ${
            !currentAnnotation || currentAnnotation.index + 1 === tasksLength
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={
            !currentAnnotation || currentAnnotation.index + 1 === tasksLength
          }
          onClick={handleNextClick}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Canvas;
