/**
 * Profile Store - In-memory data storage for users and programs
 * Implements simple CRUD operations for MVP
 */

// In-memory storage
let users = [];
let programs = [];

/**
 * User helper functions
 */
const findUserByEmail = (email) => {
  return users.find(u => u.email === email);
};

const findUserById = (id) => {
  return users.find(u => u.id === id);
};

const addUser = (user) => {
  users.push(user);
  return user;
};

const getAllUsers = () => {
  return users;
};

/**
 * Program helper functions
 */
const getAllPrograms = () => {
  return programs;
};

const findProgramById = (id) => {
  return programs.find(p => p.id === id);
};

const setPrograms = (programList) => {
  programs = programList;
};

module.exports = {
  // User operations
  findUserByEmail,
  findUserById,
  addUser,
  getAllUsers,
  
  // Program operations
  getAllPrograms,
  findProgramById,
  setPrograms
};

