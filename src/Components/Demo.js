import {
  faCompressAlt,
  faDownload,
  faHistory,
  faImage,
  faQuestionCircle,
  faTrashCanArrowUp,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Grid,
  Container,
  Card,
  CardMedia,
  Button,
  Slider,
  CircularProgress,
  Modal,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import HelpContainer from "./HelpContainer";
import HistoryContainer from "./HistoryContainer";
import { compress } from "image-conversion";
import styled from "@emotion/styled";
import { Spinner } from "react-bootstrap";

const marks = [
  {
    value: 0,
    label: "0%",
  },
  {
    value: 25,
    label: "25%",
  },
  {
    value: 50,
    label: "50%",
  },
  {
    value: 75,
    label: "75%",
  },
  {
    value: 100,
    label: "100%",
  },
];

export const Demo = () => {
  const [compressedLink, setCompressedLink] = useState("");
  const [originalImage, setOriginalImage] = useState(null);
  const [originalLink, setOriginalLink] = useState("");
  const [uploadImage, setUploadImage] = useState(false);
  const [outputFileName, setOutputFileName] = useState("");
  const [compressionQuality, setCompressionQuality] = useState(0);
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

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };
  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

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

  const NavBar = () => {
    return (
      <AppBar position="static">
        <Toolbar>
          <FontAwesomeIcon
            icon={faImage}
            className="icon"
            style={{ marginRight: "50px" }}
          />
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            IMAGE COMPRESSOR
          </Typography>
          <div>
            <FontAwesomeIcon
              icon={faQuestionCircle}
              className="help-icon"
              onClick={toggleHelp}
              style={{ color: "white", cursor: "pointer" }}
            />
          </div>
          <div>
            <FontAwesomeIcon
              icon={faHistory}
              className="history-icon"
              onClick={toggleHistory}
              style={{ color: "white", cursor: "pointer" }}
            />
          </div>
        </Toolbar>
      </AppBar>
    );
  };

  const HiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const OriginalPhotoCardContent = () => {
    return (
      <>
        <h3 style={{ display: "flex", justifyContent: "center" }}>
          Original :
        </h3>
        <Card
          sx={{
            height: 300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {uploadImage ? (
            <CardMedia
              component="img"
              sx={{ height: "100%" }}
              image={originalLink}
              alt="Uploaded Image"
            />
          ) : (
            <FontAwesomeIcon
              icon={faImage}
              style={{ fontSize: "3rem", color: "black" }}
            />
          )}
        </Card>
        <br />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            component="label"
            variant="contained"
            startIcon={<FontAwesomeIcon icon={faUpload} />}
            onChange={(event) => uploadLink(event)}
          >
            Upload File
            <HiddenInput type="file" />
          </Button>
        </div>
      </>
    );
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: "16px",
    overflow: "hidden",
  };
  const ImageModal = () => {
    return (
      <Modal open={modalShow} onClose={() => setModalShow(false)}>
        <Box sx={style}>
          <Card
            sx={{
              height: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setModalShow(false)}
          >
            <CardMedia
              component="img"
              sx={{ height: "100%" }}
              image={compressedLink}
              alt="Compressed Image"
            />
          </Card>
        </Box>
      </Modal>
    );
  };

  const CompressedPhotoCardContent = () => {
    return (
      <>
        <h3 style={{ display: "flex", justifyContent: "center" }}>Result : </h3>
        <Card
          sx={{
            height: 300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={showCompressedImage ? () => setModalShow(true) : null}
          style={{ cursor: showCompressedImage ? "pointer" : "default" }}
        >
          {showCompressedImage ? (
            <CardMedia
              component="img"
              sx={{ height: "100%" }}
              image={compressedLink}
              alt="Compressed Image"
            />
          ) : (
            <FontAwesomeIcon
              icon={faImage}
              style={{ fontSize: "3rem", color: "black" }}
            />
          )}
        </Card>
        <br />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            startIcon={<FontAwesomeIcon icon={faDownload} />}
            href={compressedLink}
            download={outputFileName}
            disabled={!showCompressedImage}
          >
            Download
          </Button>
        </div>
        <ImageModal />
      </>
    );
  };

  const CompressedSliderInputComponent = () => {
    return (
      <>
        <h3 style={{ display: "flex", justifyContent: "center" }}>
          Compressed quality :
        </h3>
        <Box padding={2}>
          <Slider
            sx={{ color: "white" }}
            color={"primary"}
            defaultValue={20}
            step={null}
            marks={marks}
            value={compressionQuality}
            onChange={(event, value) => {
              if (typeof value === "number") {
                setCompressionQuality(value);
              }
            }}
          />
        </Box>
        <div>
          Original Size: {Math.round(originalSize / 1024)} KB
          <br />
          Compressed Size: {Math.round(compressedSize / 1024)} KB
        </div>
        <br />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            style={{ marginRight: "40px" }}
            startIcon={
              loading ? (
                <CircularProgress size={20} />
              ) : (
                <FontAwesomeIcon icon={faCompressAlt} />
              )
            }
            onClick={compressImage}
            disabled={loading}
          >
            {loading ? "Compressing..." : "Compress"}
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<FontAwesomeIcon icon={faTrashCanArrowUp} />}
            onClick={resetApp}
          >
            Reset
          </Button>
        </div>
      </>
    );
  };

  const MainContent = () => {
    return (
      <Container>
        <Box my={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box
                p={2}
                bgcolor="grey"
                color="primary.contrastText"
                sx={{
                  borderRadius: "16px",
                  overflow: "hidden",
                }}
              >
                <div>
                  <OriginalPhotoCardContent />
                </div>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                p={2}
                bgcolor="grey"
                color="secondary.contrastText"
                sx={{
                  borderRadius: "16px",
                  overflow: "hidden",
                }}
              >
                <CompressedSliderInputComponent />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                p={2}
                bgcolor="grey"
                color="secondary.contrastText"
                sx={{
                  borderRadius: "16px",
                  overflow: "hidden",
                }}
              >
                <CompressedPhotoCardContent />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    );
  };

  return (
    <div>
      <NavBar />
      {showHelp && <HelpContainer />}
      {showHistory && (
        <HistoryContainer compressedHistory={compressedHistory} />
      )}
      <MainContent />
    </div>
  );
};
