/**
 * Input Validation Utilities
 * Validates user inputs before processing
 */

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid
 */
const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password
 * @param {string} password - Password
 * @returns {boolean} True if valid
 */
const validatePassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 6;
};

/**
 * Validate acres
 * @param {number} acres - Farm size in acres
 * @returns {boolean} True if valid
 */
const validateAcres = (acres) => {
  if (acres === undefined || acres === null) return false;
  const num = Number(acres);
  return !isNaN(num) && num > 0;
};

/**
 * Validate experience
 * @param {number} experience - Years of experience
 * @returns {boolean} True if valid
 */
const validateExperience = (experience) => {
  if (experience === undefined || experience === null) return false;
  const num = Number(experience);
  return !isNaN(num) && num >= 0;
};

/**
 * Validate state
 * @param {string} state - State code
 * @returns {boolean} True if valid
 */
const validateState = (state) => {
  const validStates = ['SC', 'NC', 'GA'];
  return validStates.includes(state);
};

/**
 * Validate farmer type
 * @param {array|string} farmerType - Farmer type(s)
 * @returns {boolean} True if valid
 */
const validateFarmerType = (farmerType) => {
  if (!farmerType) return false;
  const types = Array.isArray(farmerType) ? farmerType : [farmerType];
  if (types.length === 0) return false;
  
  const validTypes = ['young', 'beginning', 'small'];
  return types.every(t => validTypes.includes(t));
};

/**
 * Validate purposes
 * @param {array|string} purposes - Funding purpose(s)
 * @returns {boolean} True if valid
 */
const validatePurposes = (purposes) => {
  if (!purposes) return false;
  const purposeList = Array.isArray(purposes) ? purposes : [purposes];
  if (purposeList.length === 0) return false;
  
  const validPurposes = [
    'equipment', 'operating_costs', 'land_purchase', 'irrigation',
    'infrastructure', 'livestock', 'conservation', 'soil_health',
    'water_management', 'processing', 'marketing', 'disaster_recovery'
  ];
  return purposeList.every(p => validPurposes.includes(p));
};

/**
 * Validate registration data
 * @param {object} data - Registration data
 * @returns {object} { valid: boolean, errors: array }
 */
const validateRegistration = (data) => {
  const errors = [];
  
  if (!validateEmail(data.email)) {
    errors.push('Invalid email format');
  }
  
  if (!validatePassword(data.password)) {
    errors.push('Password must be at least 6 characters');
  }
  
  if (!validateAcres(data.acres)) {
    errors.push('Acres must be a positive number');
  }
  
  if (!validateExperience(data.experience)) {
    errors.push('Experience must be a non-negative number');
  }
  
  if (!validateState(data.state)) {
    errors.push('State must be SC, NC, or GA');
  }
  
  if (!validateFarmerType(data.farmerType)) {
    errors.push('At least one valid farmer type is required (young, beginning, small)');
  }
  
  if (!validatePurposes(data.purposes)) {
    errors.push('At least one valid funding purpose is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validate profile data
 * @param {object} data - Profile data
 * @returns {object} { valid: boolean, errors: array }
 */
const validateProfile = (data) => {
  const errors = [];
  
  if (!validateAcres(data.acres)) {
    errors.push('Acres must be a positive number');
  }
  
  if (!validateExperience(data.experience)) {
    errors.push('Experience must be a non-negative number');
  }
  
  if (!validateState(data.state)) {
    errors.push('State must be SC, NC, or GA');
  }
  
  if (!validateFarmerType(data.farmerType)) {
    errors.push('At least one valid farmer type is required');
  }
  
  if (!validatePurposes(data.purposes)) {
    errors.push('At least one valid funding purpose is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateAcres,
  validateExperience,
  validateState,
  validateFarmerType,
  validatePurposes,
  validateRegistration,
  validateProfile
};

