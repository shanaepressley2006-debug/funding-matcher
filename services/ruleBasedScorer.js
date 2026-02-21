/**
 * Rule-Based Scoring Engine (Fallback)
 * Implements weighted multi-criteria scoring algorithm
 * Used when AWS Bedrock is unavailable
 */

/**
 * Calculate match score for a program using rule-based algorithm
 * @param {object} userProfile - Farmer profile
 * @param {object} program - Funding program
 * @returns {object} Score, percentage, and reasons
 */
const calculateMatchScore = (userProfile, program) => {
  const { acres, experience, state, farmerType, purposes } = userProfile;
  
  let score = 0;
  const reasons = [];
  
  // 1. Experience Match (30 points)
  if (experience >= program.minExperience && experience <= program.maxExperience) {
    score += 30;
    if (experience <= 10) {
      reasons.push(`✓ You qualify as a beginning farmer (${experience} years)`);
    } else {
      reasons.push(`✓ Your experience level (${experience} years) qualifies`);
    }
  }
  
  // 2. Farm Size Match (20 points)
  if (acres >= program.minAcres && acres <= program.maxAcres) {
    score += 20;
    if (acres <= 300) {
      reasons.push(`✓ Perfect for small-scale operations (${acres} acres)`);
    } else {
      reasons.push(`✓ Your farm size (${acres} acres) qualifies`);
    }
  }
  
  // 3. State Location Match (15 points)
  if (program.states.includes(state)) {
    score += 15;
    reasons.push(`✓ Available in ${state}`);
  }
  
  // 4. Farmer Type Match (20 points - 10 per matching type)
  if (farmerType && program.farmerTypes) {
    const types = Array.isArray(farmerType) ? farmerType : [farmerType];
    const matchingTypes = types.filter(t => program.farmerTypes.includes(t));
    if (matchingTypes.length > 0) {
      score += matchingTypes.length * 10;
      reasons.push(`✓ Priority for ${matchingTypes.join(', ')} farmers`);
    }
  }
  
  // 5. Funding Purposes Match (25 points - 12 per matching purpose)
  if (purposes && program.purposes) {
    const userPurposes = Array.isArray(purposes) ? purposes : [purposes];
    const matchingPurposes = userPurposes.filter(p => program.purposes.includes(p));
    if (matchingPurposes.length > 0) {
      score += matchingPurposes.length * 12;
      reasons.push(`✓ Supports: ${matchingPurposes.join(', ').replace(/_/g, ' ')}`);
    }
  }
  
  // 6. Grant/Payment Bonus (10 points)
  if (program.type === 'Grant' || program.type === 'Direct Payment' || program.type === 'Cost-share Grant' || program.type === 'Annual Payment') {
    score += 10;
    reasons.push(`✓ ${program.type} - no repayment required`);
  }
  
  // 7. Deadline Urgency Bonus (5 points)
  if (program.deadline && program.deadline !== 'Year-round' && !program.deadline.includes('Check')) {
    try {
      const deadlineDate = new Date(program.deadline);
      const today = new Date();
      const daysUntil = Math.floor((deadlineDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysUntil > 0 && daysUntil < 60) {
        score += 5;
        reasons.push(`⏰ Deadline approaching: ${program.deadline}`);
      }
    } catch (error) {
      // Invalid date format, skip deadline bonus
    }
  }
  
  // 8. Fast Approval Bonus (5 points)
  if (program.applicationTime && program.applicationTime.includes('2-3 weeks')) {
    score += 5;
    reasons.push(`⚡ Fast approval: ${program.applicationTime}`);
  }
  
  // Calculate percentage (capped at 100%)
  const percentage = Math.min(Math.round((score / 100) * 100), 100);
  
  return {
    score,
    percentage,
    reasons
  };
};

/**
 * Score all programs for a user profile
 * @param {object} userProfile - Farmer profile
 * @param {array} programs - List of programs
 * @returns {array} Scored programs
 */
const scoreAllPrograms = (userProfile, programs) => {
  return programs.map(program => {
    const { score, percentage, reasons } = calculateMatchScore(userProfile, program);
    
    return {
      ...program,
      matchScore: score,
      matchPercentage: percentage,
      matchReasons: reasons
    };
  });
};

module.exports = {
  calculateMatchScore,
  scoreAllPrograms
};
