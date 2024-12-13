"use client"; // Ensure this is a client-side component

import React, { useRef, useState, useEffect } from "react";

const Canvas = ({ imageSrc, onFinish }) => {
  const canvasRef = useRef(null);
  const canvasContext = useRef(null);

  const [rectangles, setRectangles] = useState([]);
  const [textValue, setTextValue] = useState("");
  const [drawingParams, setDrawingParams] = useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    isDrawing: false,
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
        // Clear and Draw the image onto the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Draw existing rectangles with annotations
        if (rectangles.length) {
          rectangles.forEach(({ x, y, width, height, text = "" }) => {
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
        text: textValue,
      },
    ]);
    setTextValue("");
    onFinish(imageSrc, rectangles);
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
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />

      <input
        type="text"
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        placeholder="Enter annotation text"
        className="mt-6 left-5 p-2 border rounded text-black"
      />
    </div>
  );
};

export default Canvas;
