/**
 * Authentication Service
 * Handles user registration, login, JWT generation, and password security
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const profileStore = require('../models/profileStore');

// Get JWT secret from environment or use default
const JWT_SECRET = process.env.JWT_SECRET || 'hackathon_secret_key';
const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a plain text password with a hashed password
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if passwords match
 */
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate a JWT token for a user
 * @param {number} userId - User ID
 * @returns {string} JWT token
 */
const generateJWT = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET);
};

/**
 * Verify JWT token middleware
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

/**
 * Register a new user
 * @param {object} userData - User registration data
 * @returns {Promise<object>} Success message or error
 */
const register = async (userData) => {
  const { email, password, acres, experience, state, farmerType, purposes } = userData;
  
  // Validate required fields
  if (!email || !password || acres === undefined || experience === undefined || !state || !farmerType || !purposes) {
    throw new Error('All fields are required');
  }
  
  // Check for duplicate email
  const existingUser = profileStore.findUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  // Hash password
  const hashedPassword = await hashPassword(password);
  
  // Create user record
  const user = {
    id: Date.now(),
    email,
    password: hashedPassword,
    farmProfile: {
      acres,
      experience,
      state,
      farmerType: Array.isArray(farmerType) ? farmerType : [farmerType],
      purposes: Array.isArray(purposes) ? purposes : [purposes]
    },
    createdAt: new Date().toISOString()
  };
  
  // Add user to store
  profileStore.addUser(user);
  
  return { message: 'Registered successfully' };
};

/**
 * Login a user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} Token and user profile (without password)
 */
const login = async (email, password) => {
  // Find user by email
  const user = profileStore.findUserByEmail(email);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Compare password
  const isValid = await comparePassword(password, user.password);
  
  if (!isValid) {
    throw new Error('Invalid password');
  }
  
  // Generate JWT token
  const token = generateJWT(user.id);
  
  // Return sanitized user profile (exclude password)
  const { password: _, ...userWithoutPassword } = user;
  
  return {
    token,
    user: userWithoutPassword
  };
};

module.exports = {
  hashPassword,
  comparePassword,
  generateJWT,
  verifyJWT,
  register,
  login
};

