/**
 * Unified Matching Service
 * Coordinates between AWS Bedrock (primary) and rule-based scoring (fallback)
 * Implements filtering, ranking, and Best Pick identification
 */

const bedrockService = require('./bedrockService');
const ruleBasedScorer = require('./ruleBasedScorer');
const profileStore = require('../models/profileStore');

const MATCH_THRESHOLD = 30; // Minimum score to include in results

/**
 * Calculate matches using Bedrock-first approach with fallback
 * @param {object} userProfile - Farmer profile
 * @returns {Promise<array>} Ranked and filtered matches
 */
const calculateMatches = async (userProfile) => {
  const programs = profileStore.getAllPrograms();
  
  if (programs.length === 0) {
    return [];
  }
  
  let scoredPrograms = [];
  let usedBedrock = false;
  
  // Try Bedrock first
  try {
    console.log('🤖 Attempting AWS Bedrock AI matching...');
    const bedrockMatches = await bedrockService.callBedrock(userProfile, programs);
    
    // Map Bedrock results to program objects
    scoredPrograms = bedrockMatches.map(match => {
      const program = programs.find(p => p.id === match.programId);
      if (!program) return null;
      
      return {
        ...program,
        matchScore: match.score,
        matchPercentage: Math.min(Math.round((match.score / 100) * 100), 100),
        matchReasons: match.reasons
      };
    }).filter(p => p !== null);
    
    usedBedrock = true;
    console.log('✅ Using AWS Bedrock AI-powered matching');
  } catch (error) {
    // Fall back to rule-based scoring
    console.log('⚠️  Bedrock unavailable, using rule-based fallback:', error.message);
    scoredPrograms = ruleBasedScorer.scoreAllPrograms(userProfile, programs);
    usedBedrock = false;
    console.log('✅ Using rule-based matching algorithm');
  }
  
  // Filter programs below threshold
  const filteredPrograms = scoredPrograms.filter(p => p.matchScore >= MATCH_THRESHOLD);
  
  // Sort by score (descending), then by deadline urgency, then by funding amount
  const rankedPrograms = sortPrograms(filteredPrograms);
  
  // Identify Best Pick
  if (rankedPrograms.length > 0) {
    rankedPrograms[0].isBestPick = true;
  }
  
  // Add metadata about matching method
  rankedPrograms.forEach(p => {
    p.matchingMethod = usedBedrock ? 'bedrock' : 'rule-based';
  });
  
  return rankedPrograms;
};

/**
 * Sort programs by multiple criteria
 * @param {array} programs - Programs to sort
 * @returns {array} Sorted programs
 */
const sortPrograms = (programs) => {
  return programs.sort((a, b) => {
    // Primary: Sort by match score (descending)
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    
    // Secondary: Sort by deadline urgency
    const aUrgency = getDeadlineUrgency(a.deadline);
    const bUrgency = getDeadlineUrgency(b.deadline);
    if (bUrgency !== aUrgency) {
      return bUrgency - aUrgency;
    }
    
    // Tertiary: Sort by funding amount (higher first)
    const aAmount = parseFundingAmount(a.maxAmount);
    const bAmount = parseFundingAmount(b.maxAmount);
    return bAmount - aAmount;
  });
};

/**
 * Calculate deadline urgency score
 * @param {string} deadline - Deadline string
 * @returns {number} Urgency score (higher = more urgent)
 */
const getDeadlineUrgency = (deadline) => {
  if (!deadline || deadline === 'Year-round' || deadline.includes('Check')) {
    return 0;
  }
  
  try {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const daysUntil = Math.floor((deadlineDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) return 0; // Past deadline
    if (daysUntil < 30) return 3; // Very urgent
    if (daysUntil < 60) return 2; // Urgent
    if (daysUntil < 90) return 1; // Somewhat urgent
    return 0;
  } catch (error) {
    return 0;
  }
};

/**
 * Parse funding amount string to number
 * @param {string} amountStr - Amount string (e.g., "$50,000")
 * @returns {number} Numeric amount
 */
const parseFundingAmount = (amountStr) => {
  if (!amountStr) return 0;
  
  // Extract first number from string
  const match = amountStr.match(/\$?([\d,]+)/);
  if (!match) return 0;
  
  return parseInt(match[1].replace(/,/g, ''), 10);
};

module.exports = {
  calculateMatches,
  sortPrograms,
  getDeadlineUrgency,
  parseFundingAmount
};

