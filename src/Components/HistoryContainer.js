import React from "react";
import "./Compressor.css";

const HistoryContainer = ({ compressedHistory }) => {
  return (
    <div className="history-container">
      <p>Compressed History:</p>
      <ul>
        {compressedHistory.map((item, index) => (
          <li key={index}>
            <a href={item.link} download={item.name}>
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryContainer;
