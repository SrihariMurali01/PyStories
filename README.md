# PyStories

**PyStories** project, is a **PDF Story Generator** that transforms academic PDFs into engaging, flashcard-like stories for better understanding and easier study. The frontend is built with **React** and styled with **Material-UI**, while the backend is built using **Flask**. It allows users to upload PDFs, extract the content, and generate story-like flashcards for easy reading. We have also added a new feature, to generate those flash-cards as a Powerpoint file, and you can download them too!!

## Features

- Upload a PDF document to generate stories.
- Displays the story content as flashcards for easy navigation.
- Convert the flash-cards to PPTs.
- Beautiful and responsive user interface with gradient buttons and rounded cards.
- Smooth navigation between flashcards using arrow buttons.
- Backend built with Flask for handling file uploads and text processing.
- Progress bar to indicate loading state during story generation.

## Technologies Used

### Frontend:
- **React**: For building the interactive user interface.
- **Material-UI**: For styling components (buttons, progress bar, flashcards).
- **FontAwesome**: For navigation icons in flashcards.

### Backend:
- **Flask**: For handling file uploads and text processing.
- **GroQ API**: Used in the backend to process the PDF content and generate story text.

## Prerequisites

Make sure you have the following installed:

- **Node.js**: For running the React frontend.
- **Python**: For running the Flask backend.
- **pip**: For installing Python dependencies.
- **GROQ API**: Please set the Groq API with this command: 
  
  (For Windows Systems)
    ```bash
    setx GROQ_API_KEY "<Your-GROQ_API-GOES-HERE>"
    ```

  (For Linux/MAC Systems)
  ```bash
  export GROQ_API=<YOUR APO KEY GOES HERE>
  ```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/pdf-story-generator.git
cd pdf-story-generator
```

### 2. Install Frontend Dependencies

Navigate to the `client` directory and install the dependencies using npm:

```bash
cd client
npm install
```

### 3. Install Backend Dependencies

Navigate to the `backend` directory and install the Python dependencies:

```bash
cd backend
pip install -r requirements.txt
```

### 4. Running the Backend

In the `backend` directory, start the Flask server:

```bash
python app.py
```

### 5. Running the Frontend

In the `client` directory, start the React development server:

```bash
npm start
```

This will open the app at `http://localhost:3000`.

### 6. Usage

1. Open the app in the browser: `http://localhost:3000`.
2. Upload a PDF file.
3. Optionally, enter an initial prompt to guide story generation.
4. Click "Upload and Generate" to generate the flashcard stories.
5. Use the navigation buttons to flip through the flashcards.

## Directory Structure

```plaintext
pdf-story-generator/
│
├── backend/                     # Flask backend directory
│   ├── app.py                   # Main Flask application
│   ├── uploads/                 # Folder to store uploaded PDFs
│   └── requirements.txt         # Python dependencies
│
├── client/                      # React frontend directory
│   ├── public/                  # Public directory for static files
│   ├── src/                     # Source files for React
│   │   ├── App.js               # Main App component
│   │   ├── UploadComponent.js   # Component for uploading PDFs and displaying flashcards
│   │   ├── App.css              # CSS for overall styling
│   │   └── UploadComponent.css  # CSS for flashcards and buttons
│   └── package.json             # Node.js dependencies
│
├── .gitignore                   # Files to ignore in version control
└── README.md                    # This README file
```

## Screenshots

### Home Page
![Home Page](/Pages/image.png)

## Future Improvements

- Add more PDF parsing features (e.g., chapter-wise flashcards).
- Improve the accuracy of story generation.
- Support other file formats such as DOCX.


## Contact

**Author:** Srihari Murali  
**Email:** [sriharisai6230@gmail.com](mailto:sriharisai6230@gmail.com)

---
