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
  const [filePath, setFilePath] = useState(null);
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [generating, setGenerating] = useState(false); // State to manage PPT generation state
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
        const story = response.data.story; // Assuming the backend returns the full story
        const storyParagraphs = story
          .split("\n")
          .filter((paragraph) => paragraph.trim() !== ""); // Split story into paragraphs
        setParagraphs(storyParagraphs); // Set the paragraphs in state
        setFilePath(response.data.file_path);
        setCurrentIndex(0); // Reset the index to the first card
      })
      .catch((error) => {
        setLoading(false);
        alert("Error uploading file: " + error.message);
      });
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

  // Function to handle the PPT download
  const handleDownloadPPT = () => {
    setGenerating(true); // Set generating state to true when starting download
    axios.post('http://localhost:5000/download_ppt', { paragraphs, pdf_name: file.name }, { responseType: 'blob' })
        .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'flashcards.pptx');
            document.body.appendChild(link);
            link.click();
            setGenerating(false); // Reset generating state after download completes
        })
        .catch(error => {
            setGenerating(false); // Reset generating state if there's an error
            alert('Error downloading PPT: ' + error.message);
        });
  };

  // Function to reset the component to its initial state
  const handleReset = () => {
    if (filePath) {
      axios.post("http://localhost:5000/delete_file", { file_path: filePath })
        .then(() => {
          setFile(null);
          setFilePath(null);
          setParagraphs([]);
          alert("File reset and deleted successfully");
        })
        .catch((error) => {
          alert("Error deleting file: " + error.message);
        });
    }
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
            multiple
            type="file"
            onChange={handleFileChange}
          />
          <Button
            variant="contained"
            component="span"
            disabled={loading}
            sx={{
              background: "linear-gradient(45deg, #313238, #cbc9c9);",
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
        >
          Upload and Generate
        </Button>
      </Grid>
      {loading && (
        <Grid item xs={12}>
            <ClipLoader
            color="primary"
            loading={loading}
            size={50} // Size of the loader
            aria-label="Loading Spinner"
            data-testid="loader"
            />
        </Grid>
        )}

      {/* Flashcards with navigation */}
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
                style={{ zIndex: paragraphs.length - index }} // Ensure cards stack properly
              >
                <CardContent>
                  <Typography variant="body1">
                    <ReactMarkdown>{paragraph}</ReactMarkdown>
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation controls */}
          <div className="navigation-buttons">
            <Button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              variant="outlined"
            >
              <FontAwesomeIcon icon={faArrowLeft} />{" "}
              {/* Font Awesome Left Arrow */}
            </Button>
            &nbsp;&nbsp;
            <Typography variant="caption">
              {currentIndex + 1} of {paragraphs.length}
            </Typography>
            &nbsp;&nbsp;
            <Button
              onClick={handleNext}
              disabled={currentIndex === paragraphs.length - 1}
              variant="outlined"
            >
              <FontAwesomeIcon icon={faArrowRight} />{" "}
              {/* Font Awesome Right Arrow */}
            </Button>
          </div>

          {/* Generate PPT and Reset Buttons */}
          <div style={{ marginTop: 16 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDownloadPPT}
              disabled={generating} // Disable button while generating PPT
              sx={{ marginRight: 2 }}
            >
              {generating ? "Generating..." : "Download as Story PPT"}
            </Button>
            <Button
              variant="outlined"
              color="error"
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
