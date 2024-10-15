import React from 'react';
import { CssBaseline, Container, Typography, Box, AppBar, Toolbar, Paper } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import UploadComponent from './UploadComponent';
import './App.css'; // For background image and custom styling

// Create a custom theme with a gradient and primary colors.
const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // A deep purple
    },
    secondary: {
      main: '#ff5722', // A striking orange-red
    },
    background: {
      default: '#e0f2f1',
    },
  },
  typography: {
    fontFamily: 'Open-Sans, sans-serif',
    h6: {
      fontWeight: 500,
      fontSize: '1.25rem',
      letterSpacing: '0.0075em',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize the stylesheet and ensure consistent colors across browsers */}
      
      {/* AppBar with custom color and centered title */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h6" color="inherit" component="div" align="center">
              PyStories - Your very own PDF Story Generator!
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>


      {/* Main content centered */}
      <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        mb: 4,
        height: '10vh'
      }}
    >
      <Typography variant="h5" color="primary" gutterBottom>
        Transform your academic PDFs into engaging stories!
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Upload a PDF and watch our app magically turn complex topics into flashcard-style summaries.
        Whether you're cramming for an exam or just love breaking down big concepts into bite-sized stories,
        this is the tool for you!
      </Typography>
    </Box>
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '70vh',
          maxHeight: '500px',
          transition: 'max-height 0.5s ease', // Full height for centering vertically
        }}
      >
        <Paper
          elevation={5} // Higher elevation for a highlight shadow
          sx={{
            p: 4, // Padding inside the Paper
            borderRadius: '16px', // Rounded corners
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', // Highlight shadow
            width: '100%',
            maxWidth: '600px', // Limit the maximum width of the Paper
          }}
        >
          <Typography variant="h6" gutterBottom align="center">
            Upload a PDF to generate your story!
          </Typography>
          <UploadComponent />
        </Paper>
      </Container>

      {/* Footer */}
      <footer>
        <Typography variant="body2" align="center">
          Created By Srihari Murali | <a href="mailto:sriharisai6230@gmail.com">sriharisai6230@gmail.com</a>
        </Typography>
      </footer>
    </ThemeProvider>
  );
}

export default App;
