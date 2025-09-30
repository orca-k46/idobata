import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import teamRoutes from "./routes/teamRoutes.js"; // Import team routes
import documentRoutes from "./routes/documentRoutes.js"; // Import document routes
import teamDocumentRoutes from "./routes/teamDocumentRoutes.js"; // Import team document routes
import { callLLM } from "./services/llmService.js"; // Import LLM service

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- Database Connection ---
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.warn("Warning: MONGODB_URI is not defined in the .env file.");
  console.warn("Continuing without MongoDB for testing purposes");
}

try {
  await mongoose.connect(mongoUri || "mongodb://localhost:27017/kaze_no_tani_docs");
  console.log("MongoDB connected successfully.");
} catch (err) {
  console.error("MongoDB connection error:", err);
  console.warn("Continuing without MongoDB for testing purposes");
}

// --- Express App Setup ---
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",").map((url) => url.trim())
      : ["http://localhost:5173", "http://localhost:5175"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const PORT = process.env.PORT || 3000; // Use port from env or default to 3000

// --- Middleware ---
// CORS: Allow requests from the frontend development server
app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
      : ["http://localhost:5173", "http://localhost:5175"],
    // Add other origins (e.g., production frontend URL) if needed
  })
);

// JSON Parser: Parse incoming JSON requests
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

import authRoutes from "./routes/authRoutes.js";
import siteConfigRoutes from "./routes/siteConfigRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Team management routes
app.use("/api/teams", teamRoutes);

// Document management routes
app.use("/api/documents", documentRoutes);

// Team-specific document routes
app.use("/api/teams/:teamId/documents", teamDocumentRoutes);

// User and config routes
app.use("/api/auth", authRoutes);
app.use("/api/site-config", siteConfigRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Serve static files in production ---
// This section will be useful when deploying to production
// For development, we'll handle this with a fallback route
if (process.env.NODE_ENV === "production") {
  // Serve static files from the React app build directory
  const frontendBuildPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendBuildPath));

  // For any request that doesn't match an API route, serve the React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}

// For development, add a fallback route to handle non-API requests
app.use((req, res, next) => {
  // If this is an API request, continue to the API routes
  if (req.path.startsWith("/api")) {
    return next();
  }

  const userIdProfileImageRegex = /^\/([0-9a-f-]+)\/profile-image$/;
  const match = req.path.match(userIdProfileImageRegex);
  if (match && req.method === "POST") {
    console.log(
      `Redirecting request from ${req.path} to /api/users${req.path}`
    );
    req.url = `/api/users${req.path}`;
    return next();
  }

  // For all other routes in development, respond with a message
  res.status(200).send(`
<html>
    <head><title>Development Mode</title></head>
    <body>
        <h1>Backend Development Server</h1>
        <p>This is the backend server running in development mode.</p>
        <p>For client-side routing to work properly in development:</p>
        <ul>
            <li>Make sure your frontend Vite dev server is running (npm run dev in the frontend directory)</li>
            <li>Access your app through the Vite dev server URL (typically http://localhost:5173)</li>
            <li>The Vite dev server will proxy API requests to this backend server</li>
        </ul>
    </body>
</html>
`);
});

// --- Error Handling Middleware (Example - Add more specific handlers later) ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// --- Socket.IO Setup ---
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("subscribe-team", (teamId) => {
    console.log(`Socket ${socket.id} subscribing to team: ${teamId}`);
    socket.join(`team:${teamId}`);
  });

  socket.on("subscribe-document", (documentId) => {
    console.log(`Socket ${socket.id} subscribing to document: ${documentId}`);
    socket.join(`document:${documentId}`);
  });

  socket.on("unsubscribe-team", (teamId) => {
    console.log(`Socket ${socket.id} unsubscribing from team: ${teamId}`);
    socket.leave(`team:${teamId}`);
  });

  socket.on("unsubscribe-document", (documentId) => {
    console.log(`Socket ${socket.id} unsubscribing from document: ${documentId}`);
    socket.leave(`document:${documentId}`);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

export { io };

// --- Start Server ---
httpServer.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
