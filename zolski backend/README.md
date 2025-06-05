# Zolski Backend

This is the backend server for the Zolski AI application. It provides the API endpoints for AI chat functionality using Google's Gemini API.

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Google Gemini API Key

## Setup

1. Clone the repository:
```bash
git clone <your-repository-url>
cd zolski-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Gemini API key:
```
GEMINI_API_KEY=your_api_key_here
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 3001 by default. You can change this by setting the `PORT` environment variable.

## API Endpoints

### Health Check
- `GET /`
  - Returns a simple message indicating the server is running

### Chat
- `POST /chat`
  - Endpoint for AI chat interactions
  - Request body should contain a `contents` array with chat history
  - Returns AI response in the format: `{ reply: "AI response text" }`

## Environment Variables

- `PORT`: Server port (default: 3001)
- `GEMINI_API_KEY`: Your Google Gemini API key

## CORS Configuration

The server is configured to accept requests from:
- `http://localhost:3000`
- `http://localhost:3001`
- Your deployed frontend URL (update in `server.js`)

## Error Handling

The server includes comprehensive error handling for:
- Missing API key
- Invalid request format
- Gemini API errors
- Network issues

## License

ISC 