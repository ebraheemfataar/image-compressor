import React from "react";
import "./Compressor.css";

const HelpContainer = () => {
  return (
    <div className="help-container">
      <p>Instructions:</p>
      <ul>
        <li>Upload an image using the "Upload a file" button.</li>
        <li>Adjust the compression quality using the slider.</li>
        <li>Press the "Compress" button to start the compression.</li>
        <li>Download the compressed image using the "Download" button.</li>
      </ul>
    </div>
  );
};

export default HelpContainer;
