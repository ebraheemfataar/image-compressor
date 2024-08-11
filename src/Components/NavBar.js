import React from "react";
import { Navbar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faQuestionCircle,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import "./Compressor.css";

const NavBar = ({ showHistory, setShowHistory, showHelp, setShowHelp }) => {
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };
  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  return (
    <Navbar
      className="navbar justify-content-between"
      bg="light"
      variant="dark"
    >
      <div>
        <Navbar.Brand className="navbar-content">
          <center>
            <FontAwesomeIcon icon={faImage} className="icon" />
            GeeksforGeeks Image Compressor
          </center>
        </Navbar.Brand>
      </div>
      <div className="navbar-actions">
        <FontAwesomeIcon
          icon={faQuestionCircle}
          className="help-icon"
          onClick={toggleHelp}
        />
        <FontAwesomeIcon
          icon={faHistory}
          className="history-icon"
          onClick={toggleHistory}
        />
      </div>
    </Navbar>
  );
};

export default NavBar;
