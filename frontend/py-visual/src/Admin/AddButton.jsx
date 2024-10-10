import React, { useEffect, useRef, useState } from "react";
import FabricButton from "../classes/button";
import axios from "axios";
import Swal from "sweetalert2";
import load from "../assets/loading.gif";
//import { fabric } from 'fabric';

const AddButton = () => {
  const canvasRef = useRef(null);
  const [canvasObj, setCanvasObj] = useState(null);
  const [elementData, setElementData] = useState({
    id: Date.now(),
    type: "BasicButton",
    x: 150,
    y: 150,
    width: 150,
    height: 30,
    text: "Submit",
    fontFamily: "Roboto",
    fontSize: 16,
    textColor: "#FFFFFF",
    idleColor: "#38b6ff",
    hoverColor: "#7cc8f4",
    clickedColor: "#155980",
    borderColor: "#000000",
    borderThickness: 1,
  });

  const [loading, setLoading] = useState(false);

  // Initialize Fabric canvas
  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const canvas = new fabric.Canvas(canvasEl, {
      width: 500,
      height: 350,
      backgroundColor: "#f3f3f3",
      selection: false,
    });
    setCanvasObj(canvas);

    return () => {
      canvas.dispose();
      setCanvasObj(null);
    };
  }, []);

  // Function to create and add the fabric element
  const addElementToCanvas = async () => {
    if (!canvasObj) return;
    canvasObj.clear(); // Clear canvas before adding new elements
    const fabricElement = await createFabricElement(elementData);
    if (fabricElement) {
      canvasObj.add(fabricElement);
      fabricElement.on("selected", () => {
        setElementData((prev) => ({
          ...prev,
          id: fabricElement.id,
        }));
      });
    }
  };

  useEffect(() => {
    addElementToCanvas();
  }, [canvasObj, elementData]); // Trigger when canvasObj or elementData changes

  const createFabricElement = (element) => {
    if (!canvasObj) return null;

    const fabricElement = new FabricButton(
      canvasObj,
      element.x,
      element.y,
      element.width,
      element.height,
      element.text,
      element.fontFamily,
      element.fontSize,
      element.textColor,
      element.idleColor,
      element.hoverColor,
      element.clickedColor,
      element.borderColor,
      element.borderThickness,
      element.onClick,
      element.onHover,
      element.onRelease
    ).buttonGroup;

    fabricElement.set({
      selectable: true, // Allow dragging
      hasControls: true, // Show controls for resizing, etc.
      hasBorders: true, // Show borders
    });

    return fabricElement;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check if the field should be a number and convert if necessary
    const updatedValue = [
      "width",
      "height",
      "borderThickness",
      "fontSize",
      "x",
      "y",
    ].includes(name)
      ? parseFloat(value) || 1 // Convert to float, default to 0 if NaN
      : value || ""; // Keep as string or empty string

    setElementData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  // Handle submit to send data to API
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://py-visual-backend.vercel.app/api/buttons/",
        elementData
      );
      const result = await response.data;
      console.log("Button saved:", result);
      setLoading(false);
      Swal.fire({
        title: "Button Added Successfully",
        showCancelButton: false,
        confirmButtonText: "ok",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      console.error("Error saving button:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex border rounded shadow-sm">
      <div className=" w-[30%] h-[400px] p-4 overflow-auto">
        {" "}
        {/* Added overflow-auto */}
        <h2 className="text-lg font-bold">Properties</h2>
        {Object.keys(elementData).map((key) => (
          <div key={key} className="mb-2">
            <label className="block">{key}:</label>
            {key === "fontFamily" ? (
              <select
                name="fontFamily"
                value={elementData.fontFamily}
                onChange={handleInputChange}
                className="border p-1 rounded"
              >
                <option value="Arial">Arial</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Trebuchet MS">Trebuchet MS</option>
                <option value="Verdana">Verdana</option>
                <option value="sans-serif">Sans-Serif</option>
                <option value="serif">Serif</option>
              </select>
            ) : (
              <input
                type={
                  key.includes("Color")
                    ? "color"
                    : key.includes("borderThickness") ||
                      key.includes("height") ||
                      key.includes("width")
                    ? "number"
                    : "text"
                }
                name={key}
                value={elementData[key]}
                onChange={handleInputChange}
                className="border p-1 rounded"
              />
            )}
          </div>
        ))}
        {!loading ? (
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Submit
          </button>
        ) : (
          <img src={load} alt="loading" className="w-[50px] h-[50px]" />
        )}
      </div>
      <div className="w-[70%] h-[450px]">
        <div className="flex items-center justify-center p-4 relative">
          <canvas ref={canvasRef} id="canvas" className="border shadow-lg" />
        </div>
      </div>
    </div>
  );
};

export default AddButton;
