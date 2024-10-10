import React, { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import axios from "axios";
import ButtonComponent from "../components/buttonComponet";
import TextComponent from "../components/textComponent";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [buttonData, setButtonData] = useState([]); // To store fetched button data
  const [textData, setTextData] = useState([]); // To store fetched text data
  const [buttonImmageData, setButtonImageData] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Fetch button data from API when component mounts
  useEffect(() => {
    const fetchButtonData = async () => {
      try {
        const response = await axios.get(
          "https://py-visual-backend.vercel.app/api/buttons/"
        ); // Replace with your actual API endpoint
        setButtonData(response.data); // Set fetched button data
      } catch (error) {
        console.error("Error fetching button data:", error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    const fetchButtonImageData = async () => {
      try {
        const response = await axios.get(
          "https://py-visual-backend.vercel.app/api/buttonImages/"
        ); // Replace with your actual API endpoint
        setButtonImageData(response.data); // Set fetched button data
      } catch (error) {
        console.error("Error fetching button data:", error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    const fetchTextData = async () => {
      try {
        const response = await axios.get(
          "https://py-visual-backend.vercel.app/api/texts/"
        ); // Replace with your actual API endpoint for text
        setTextData(response.data); // Set fetched text data
      } catch (error) {
        console.error("Error fetching text data:", error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    // Call both APIs
    fetchButtonData();
    fetchTextData();
    fetchButtonImageData();
  }, []);

  const onAddElement = (type, element) => {
    navigate("/edit-element", { state: { type, element } });
  };

  return (
    <div className=" flex flex-col antialiased">
      <Header />
      <Sidebar />
      {/* Main content area */}
      <div className="flex-grow p-6 ml-64 mt-14">
        <h1 className="text-4xl font-bold text-blue-900 mb-6">Buttons</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {buttonData.map((button) => (
            <button
              key={button._id} // Use _id from the API response
              onClick={() => onAddElement("Button", button)}
              className="bg-gray-100 p-3 rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              <ButtonComponent
                text={button.text}
                idleColor={button.idleColor} // Green idle color
                hoverColor={button.hoverColor} // Light green hover color
                clickedColor={button.clickedColor} // Dark green clicked color
                textColor={button.textColor} // White text
                width={150}
                height={40}
                border_thickness={button.borderThickness}
                borderColor={button.borderColor}
              />
            </button>
          ))}
          {buttonImmageData.map((Button, index) => (
            <button
              key={index}
              className="bg-gray-100 p-3 rounded-lg shadow-lg transition-all transform hover:scale-105"
              onClick={() => onAddElement("ButtonImage", Button)}
              onMouseEnter={() => setHoveredIndex(index)} // Set hovered index on mouse enter
              onMouseLeave={() => setHoveredIndex(null)} // Reset hovered index on mouse leave
            >
              <img
                src={
                  hoveredIndex === index ? Button.hoverImage : Button.idleImage
                }
                alt="Button"
                className="max-w-[110px] max-h-[70px] m-auto p-2"
              />
            </button>
          ))}
        </div>
      </div>
      <div className="flex-grow p-6 ml-64 mt-6">
        <h1 className="text-4xl font-bold text-blue-900 mb-6">Text</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {textData.map((textItem) => (
            <button
              key={textItem._id} // Use _id from the API response
              className="w-full border p-3 rounded-lg shadow-lg transition-all transform hover:scale-105 bg-gray-100"
              onClick={() => onAddElement("Text", textItem)}
            >
              <TextComponent
                text={
                  textItem.text.length > 10
                    ? textItem.text.slice(0, 10)
                    : textItem.text
                }
                color={textItem.color}
                fontFamily={textItem.fontFamily}
                italic={textItem.italic}
                bold={textItem.bold}
                underline={textItem.underline}
                strikethrough={textItem.strikethrough}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
