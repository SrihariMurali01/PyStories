import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import {
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ReactMarkdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons"; // Import icons
import "./UploadComponent.css"; // For custom animations and styles

// Custom styled component for the file input
const Input = styled("input")({
  display: "none",
});

function UploadComponent() {
  const [file, setFile] = useState(null); // State to store the uploaded file
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [paragraphs, setParagraphs] = useState([]); // State to store the generated paragraphs
  const [currentIndex, setCurrentIndex] = useState(0); // State to keep track of the current card

  // Handles the file input change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handles the file upload process and generates flashcards
  const handleFileUpload = () => {
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    axios
      .post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setLoading(false);
        const story = response.data.story;
        const storyParagraphs = story
          .split("\n")
          .filter((paragraph) => paragraph.trim() !== "");
        setParagraphs(storyParagraphs);
        setCurrentIndex(0);
      })
      .catch((error) => {
        setLoading(false);
        alert("Error uploading file: " + error.message);
      });
  };

  // Function to reset the component to its initial state
  const handleReset = () => {
    setFile(null);
    setParagraphs([]);
    setCurrentIndex(0);
    setLoading(false);
  };

  // Function to navigate to the next card
  const handleNext = () => {
    if (currentIndex < paragraphs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Function to navigate to the previous card
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Function to download flashcards as PPT
  const handleDownloadPPT = () => {
    axios
      .post("http://localhost:5000/download_ppt", { paragraphs }, { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "flashcards.pptx");
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        alert("Error downloading PPT: " + error.message);
      });
  };

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      alignItems="center"
      direction="column"
    >
      <Grid item xs={12}>
        <label htmlFor="contained-button-file">
          <Input
            accept="application/pdf"
            id="contained-button-file"
            type="file"
            onChange={handleFileChange}
          />
          <Button
            variant="contained"
            component="span"
            disabled={loading}
            sx={{
              background: "linear-gradient(45deg, #313238, #cbc9c9)",
              color: "white",
              margin: "10px",
            }}
          >
            Select File
          </Button>
        </label>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleFileUpload}
          disabled={loading || !file}
          sx={{ marginBottom: "10px" }}
        >
          Upload and Generate
        </Button>
      </Grid>
      {loading && (
        <Grid item xs={12}>
          <ClipLoader color="#6200ea" loading={loading} size={50} />
        </Grid>
      )}

      {paragraphs.length > 0 && (
        <Grid item xs={12}>
          <div className="card-container-stacked">
            {paragraphs.map((paragraph, index) => (
              <Card
                key={index}
                variant="outlined"
                className={`flashcard-stacked ${
                  index === currentIndex ? "active" : ""
                }`}
                style={{ zIndex: paragraphs.length - index }}
              >
                <CardContent>
                  <Typography variant="body1">
                    <ReactMarkdown>{paragraph}</ReactMarkdown>
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="navigation-buttons">
            <Button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              variant="outlined"
              sx={{ marginRight: 1 }}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
            <Typography variant="caption">
              {currentIndex + 1} of {paragraphs.length}
            </Typography>
            <Button
              onClick={handleNext}
              disabled={currentIndex === paragraphs.length - 1}
              variant="outlined"
              sx={{ marginLeft: 1 }}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </div>

          {/* Download and Reset Buttons */}
          <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDownloadPPT}
              sx={{ marginRight: 2 }}
            >
              Download as PPT
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </Grid>
      )}
    </Grid>
  );
}

export default UploadComponent;
