// Components/Compressor.js
import React, { useState, useEffect } from "react";
import { Card, Spinner, Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faDownload,
  faUpload,
  faImage as faImagePlaceholder,
} from "@fortawesome/free-solid-svg-icons";
import "./Compressor.css";
import { compress } from "image-conversion";
import NavBar from "./NavBar";
import HelpContainer from "./HelpContainer";
import HistoryContainer from "./HistoryContainer";

export const CompressorComp = () => {
  const [compressedLink, setCompressedLink] = useState("");
  const [originalImage, setOriginalImage] = useState(null);
  const [originalLink, setOriginalLink] = useState("");
  const [uploadImage, setUploadImage] = useState(false);
  const [outputFileName, setOutputFileName] = useState("");
  const [compressionQuality, setCompressionQuality] = useState(0.8);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [isCompressed, setIsCompressed] = useState(false);
  const [compressionInProgress, setCompressionInProgress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [compressedHistory, setCompressedHistory] = useState([]);
  const [showCompressedImage, setShowCompressedImage] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    if (originalImage) {
      setCompressedLink("");
      setCompressedSize(0);
      setIsCompressed(false);
      setShowCompressedImage(false);
    }
  }, [originalImage]);

  const uploadLink = async (event) => {
    const imageFile = event.target.files[0];
    setOriginalLink(URL.createObjectURL(imageFile));
    setOriginalImage(imageFile);
    setOutputFileName(imageFile.name);
    setUploadImage(true);
    setOriginalSize(imageFile.size);
  };

  const compressImage = async () => {
    if (!originalImage) {
      alert("Please upload an image first.");
      return;
    }
    try {
      setCompressionInProgress(true);
      setShowCompressedImage(false);
      setLoading(true);
      const compressedImage = await compress(originalImage, {
        quality: compressionQuality,
        width: 800,
        height: 800,
      });
      setCompressedLink(URL.createObjectURL(compressedImage));
      setCompressedSize(compressedImage.size);
      setIsCompressed(true);
      setCompressedHistory([
        ...compressedHistory,
        { link: compressedLink, name: outputFileName },
      ]);
      setTimeout(() => {
        setLoading(false);
        setShowCompressedImage(true);
      }, 2000);
    } catch (error) {
      console.error("Image compression failed:", error);
      alert("Image compression failed. Please try again.");
    } finally {
      setCompressionInProgress(false);
    }
  };

  const resetApp = () => {
    setOriginalLink("");
    setOriginalImage(null);
    setUploadImage(false);
    setOutputFileName("");
    setCompressionQuality(0.8);
    setOriginalSize(0);
    setCompressedSize(0);
    setIsCompressed(false);
    setCompressedLink("");
    setShowCompressedImage(false);
  };

  return (
    <div className="mainContainer">
      <NavBar
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        showHelp={showHelp}
        setShowHelp={setShowHelp}
      />
      {showHelp && <HelpContainer />}
      {showHistory && (
        <HistoryContainer compressedHistory={compressedHistory} />
      )}
      <div className="row mt-5">
        <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
          {uploadImage ? (
            <Card.Img
              className="image"
              variant="top"
              src={originalLink}
              alt="Original Image"
            />
          ) : (
            <Card.Img
              className="uploadCard"
              variant="top"
              // @ts-ignore
              src={faUpload}
              alt=""
            />
          )}
          <div className="d-flex justify-content-center upload-btn-wrapper">
            <label htmlFor="uploadBtn" className="btn btn-primary">
              <FontAwesomeIcon icon={faUpload} className="icon" />
              Upload a file
            </label>
            <input
              type="file"
              id="uploadBtn"
              accept="image/*"
              className="mt-2 btn btn-primary w-75"
              onChange={(event) => uploadLink(event)}
            />
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 d-flex justify-content-center align-items-baseline">
          <div>
            {outputFileName ? (
              <div>
                <label htmlFor="qualitySlider">Compression Quality:</label>
                <input
                  id="qualitySlider"
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={compressionQuality}
                  onChange={(event) =>
                    setCompressionQuality(parseFloat(event.target.value))
                  }
                />
                <div className="text-center">
                  Original Size: {Math.round(originalSize / 1024)} KB
                  <br />
                  Compressed Size: {Math.round(compressedSize / 1024)} KB
                </div>
                <div className="text-center">
                  {isCompressed && !compressionInProgress && (
                    <div className="text-success compressed-message">
                      Image compressed successfully!
                    </div>
                  )}
                  {compressionInProgress && (
                    <div className="text-info">Compressing image...</div>
                  )}
                </div>
                <div className="button-container">
                  {loading ? (
                    <div className="text-info">Loading...</div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={compressImage}
                    >
                      <FontAwesomeIcon icon={faImage} className="icon" />
                      Compress
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-danger ml-3"
                    onClick={resetApp}
                  >
                    Reset
                  </button>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
          {showCompressedImage ? (
            <div>
              <Card.Img
                className="image"
                variant="top"
                src={compressedLink}
                alt="Compressed Image"
                onClick={() => setModalShow(true)}
                style={{ cursor: "pointer" }}
              />
              <a
                href={compressedLink}
                download={outputFileName}
                className="mt-2 btn btn-success w-75 download-btn"
              >
                <FontAwesomeIcon icon={faDownload} className="icon" />
                Download
              </a>
              <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="lg"
              >
                <Modal.Body className="text-center">
                  <Card.Img
                    className="image"
                    variant="top"
                    src={compressedLink}
                    alt="Compressed Image"
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setModalShow(false)}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-center">
              {compressionInProgress && (
                <Spinner animation="border" variant="primary" />
              )}
              {!uploadImage && !compressionInProgress && (
                <FontAwesomeIcon
                  icon={faImagePlaceholder}
                  className="icon"
                  size="3x"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
