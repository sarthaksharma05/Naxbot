// server.js - Your Node.js Backend Server

// 1. Import necessary modules
const express = require('express'); // Express.js for building the web server
const cors = require('cors');     // CORS to handle cross-origin requests from your frontend
const axios = require('axios');   // Axios for making HTTP requests (e.g., to Gemini API)
const path = require('path');     // Path module for working with file and directory paths

// 2. Initialize the Express app
const app = express();

// 3. Middleware setup
app.use(express.json()); // Enable Express to parse JSON formatted request bodies

// Configure CORS (Cross-Origin Resource Sharing)
// This is crucial! It allows your frontend (hosted on Render) to make requests to this backend.
// Replace 'https://your-frontend-name.onrender.com' with the actual URL of your deployed Render Static Site.
// For local development, you might also want to add 'http://localhost:port' if your frontend runs locally.
// IMPORTANT: For production, do NOT use app.use(cors()); without specific origins.
app.use(cors({
  origin: ['https://your-frontend-name.onrender.com', 'http://localhost:3000', 'http://localhost:3001'] // IMPORTANT: Update 'https://your-frontend-name.onrender.com' with your actual frontend URL!
}));

// IMPORTANT: Load Gemini API Key from an environment variable.
// DO NOT hardcode your API key directly in your code for production.
// On Render, you will set this as an environment variable (e.g., GEMINI_API_KEY).
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // This will be loaded from Render's environment variables

// Check if API key is present
if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY environment variable is not set. AI functionality may not work.');
}

// 4. Define the port for the server to listen on
// Render provides a 'PORT' environment variable. Use it, or a default for local development.
const PORT = process.env.PORT || 3001; // Use 3001 for local to avoid conflict with a frontend running on 3000

// 5. Define API Routes

// Root endpoint for health check or basic info
app.get('/', (req, res) => {
  res.status(200).send('Zolski AI Backend is running!');
});

// Chat Endpoint for AI interaction
// This endpoint makes a call to the Gemini API.
app.post('/chat', async (req, res) => {
  const { contents } = req.body; // Assuming the frontend sends a 'contents' array (chat history)

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API Key is not configured on the backend.' });
  }

  if (!Array.isArray(contents) || contents.length === 0) {
    console.error("Invalid or empty chat history received from frontend.");
    return res.status(400).json({ error: "Invalid or empty chat history provided." });
  }

  try {
    console.log(`Received chat request. Last user prompt: "${contents[contents.length - 1].parts[0].text}"`);

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      { contents }, // Pass the chat history directly
      { headers: { "Content-Type": "application/json" } }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (reply) {
      res.json({ reply });
    } else {
      console.error("Failed to get a valid reply from Gemini:", response.data);
      res.status(500).json({ error: "Failed to get a valid reply from Gemini (unexpected structure or no content)." });
    }

  } catch (error) {
    if (error.response) {
      console.error("Error from Gemini API:", error.response.status, error.response.data);
      res.status(error.response.status).json({
        error: `Gemini API error: ${error.response.data.error?.message || 'Unknown API error'}`
      });
    } else if (error.request) {
      console.error("No response received from Gemini API:", error.request);
      res.status(500).json({
        error: "No response from Gemini API. Check network connection or API service status."
      });
    } else {
      console.error("Error setting up request to Gemini API:", error.message);
      res.status(500).json({
        error: `Backend internal error: ${error.message}`
      });
    }
  }
});

// 6. Start the server
app.listen(PORT, () => {
  // Using string concatenation here to avoid template literal issues.
  console.log('Server listening on port ' + PORT);
  console.log('Access your backend at: http://localhost:' + PORT + ' (for local development)');
  console.log('Remember to update your frontend with the deployed Render backend URL!');
});
