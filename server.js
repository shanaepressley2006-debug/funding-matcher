require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Import services
const authService = require("./services/authService");
const matchingService = require("./services/matchingService");
const profileStore = require("./models/profileStore");
const programData = require("./models/programData");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Initialize program data
profileStore.setPrograms(programData);

console.log('🚀 Smart Farm Funding Matcher - Starting...');
console.log(`📊 Loaded ${programData.length} funding programs`);

/* =========================
   AUTH ROUTES
========================= */

/**
 * POST /api/register
 * Register a new user with farm profile
 */
app.post("/api/register", async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.json(result);
  } catch (error) {
    const statusCode = error.message === 'User already exists' ? 400 : 500;
    res.status(statusCode).json({ 
      message: error.message || "Registration failed",
      error: error.message 
    });
  }
});

/**
 * POST /api/login
 * Login user and return JWT token
 */
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    const statusCode = error.message === 'User not found' || error.message === 'Invalid password' ? 400 : 500;
    res.status(statusCode).json({ 
      message: error.message || "Login failed",
      error: error.message 
    });
  }
});

/* =========================
   MATCHING ROUTES
========================= */

/**
 * POST /api/match
 * Calculate program matches for user profile
 * Uses AWS Bedrock (primary) with rule-based fallback
 */
app.post("/api/match", async (req, res) => {
  try {
    const { acres, experience, state, farmerType, purposes } = req.body;
    
    // Validate required fields
    if (acres === undefined || experience === undefined || !state || !farmerType || !purposes) {
      return res.status(400).json({ 
        message: "All fields are required",
        error: "Missing required fields" 
      });
    }
    
    const userProfile = {
      acres,
      experience,
      state,
      farmerType: Array.isArray(farmerType) ? farmerType : [farmerType],
      purposes: Array.isArray(purposes) ? purposes : [purposes]
    };
    
    const matches = await matchingService.calculateMatches(userProfile);
    res.json(matches);
  } catch (error) {
    console.error('Match error:', error);
    res.status(500).json({ 
      message: "Match calculation failed",
      error: error.message 
    });
  }
});

/**
 * GET /api/programs
 * Get all available funding programs
 */
app.get("/api/programs", (req, res) => {
  try {
    const programs = profileStore.getAllPrograms();
    res.json(programs);
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to retrieve programs",
      error: error.message 
    });
  }
});

/* =========================
   SERVE FRONTEND
========================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    message: "Internal server error",
    error: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
  });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📂 Open http://localhost:${PORT} in your browser`);
  console.log(`🤖 AWS Bedrock: ${process.env.AWS_ACCESS_KEY_ID ? 'Configured' : 'Not configured (using fallback)'}`);
});

