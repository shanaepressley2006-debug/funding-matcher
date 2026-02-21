/**
 * AWS Bedrock Service
 * Handles AI-powered matching using Claude 3 Haiku via AWS Bedrock
 * Includes timeout handling and error management
 */

const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

// Configuration from environment variables
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const BEDROCK_MODEL_ID = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0';
const BEDROCK_TIMEOUT = parseInt(process.env.BEDROCK_TIMEOUT || '30000', 10);

// Initialize Bedrock client
let bedrockClient = null;

/**
 * Initialize Bedrock client with AWS credentials
 */
const initializeBedrockClient = () => {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  
  if (!accessKeyId || !secretAccessKey) {
    console.warn('⚠️  AWS credentials not configured. Bedrock service will not be available. Using fallback mode.');
    return null;
  }
  
  try {
    bedrockClient = new BedrockRuntimeClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    });
    console.log('✅ AWS Bedrock client initialized successfully');
    return bedrockClient;
  } catch (error) {
    console.error('❌ Failed to initialize Bedrock client:', error.message);
    return null;
  }
};

/**
 * Build prompt for Bedrock API
 * @param {object} userProfile - Farmer profile
 * @param {array} programs - List of programs
 * @returns {string} Formatted prompt
 */
const buildPrompt = (userProfile, programs) => {
  const { acres, experience, state, farmerType, purposes } = userProfile;
  
  const programsText = programs.map(p => `
ID: ${p.id}
Name: ${p.name}
Agency: ${p.agency}
Type: ${p.type}
Max Amount: ${p.maxAmount}
Eligibility: ${p.minExperience}-${p.maxExperience} years experience, ${p.minAcres}-${p.maxAcres} acres
States: ${p.states.join(', ')}
Farmer Types: ${p.farmerTypes.join(', ')}
Purposes: ${p.purposes.join(', ')}
Deadline: ${p.deadline}
Benefits: ${p.benefits.join('; ')}
`).join('\n---\n');
  
  return `You are a funding matching expert for farmers. Analyze the farmer profile and score each program from 0-100 based on how well it matches their needs.

Farmer Profile:
- Farm Size: ${acres} acres
- Experience: ${experience} years
- State: ${state}
- Farmer Types: ${farmerType.join(', ')}
- Funding Needs: ${purposes.join(', ')}

Programs:
${programsText}

Return a JSON array with this exact structure:
[
  {
    "programId": <number>,
    "score": <number 0-100>,
    "reasons": [<array of 2-5 specific reasons why this program matches>]
  }
]

Scoring guidelines:
- Experience match (up to 30 points): Does farmer's experience fall within program's range?
- Farm size match (up to 20 points): Does farm size fit program's requirements?
- State availability (up to 15 points): Is program available in farmer's state?
- Farmer type alignment (up to 20 points): Does program prioritize farmer's types?
- Funding purpose match (up to 25 points): Does program support farmer's needs?
- Grant/payment bonus (10 points): No repayment required
- Deadline urgency (5 points): Application deadline within 60 days
- Fast approval (5 points): Quick processing time (2-3 weeks)

Provide specific, actionable reasons for each match score.`;
};

/**
 * Parse Bedrock API response
 * @param {object} response - Raw Bedrock response
 * @returns {array} Parsed matches array
 */
const parseBedrockResponse = (response) => {
  try {
    // Decode response body
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    // Extract content from Bedrock response structure
    if (!responseBody.content || !responseBody.content[0] || !responseBody.content[0].text) {
      throw new Error('Invalid Bedrock response structure');
    }
    
    const content = responseBody.content[0].text;
    
    // Extract JSON from response (may be wrapped in markdown code blocks)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in Bedrock response');
    }
    
    const matches = JSON.parse(jsonMatch[0]);
    
    // Validate response structure
    if (!Array.isArray(matches)) {
      throw new Error('Bedrock response is not an array');
    }
    
    for (const match of matches) {
      if (!match.programId || typeof match.score !== 'number' || !Array.isArray(match.reasons)) {
        throw new Error('Invalid match structure in Bedrock response');
      }
    }
    
    return matches;
  } catch (error) {
    throw new Error(`Failed to parse Bedrock response: ${error.message}`);
  }
};

/**
 * Call Bedrock API with timeout
 * @param {object} userProfile - Farmer profile
 * @param {array} programs - List of programs
 * @returns {Promise<array>} Scored matches
 */
const callBedrock = async (userProfile, programs) => {
  if (!bedrockClient) {
    bedrockClient = initializeBedrockClient();
    if (!bedrockClient) {
      throw new Error('Bedrock client not initialized');
    }
  }
  
  const prompt = buildPrompt(userProfile, programs);
  
  const params = {
    modelId: BEDROCK_MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    })
  };
  
  const command = new InvokeModelCommand(params);
  
  // Create timeout promise
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Bedrock API timeout')), BEDROCK_TIMEOUT);
  });
  
  try {
    // Race between API call and timeout
    const response = await Promise.race([
      bedrockClient.send(command),
      timeoutPromise
    ]);
    
    const matches = parseBedrockResponse(response);
    logBedrockCall(userProfile, true);
    
    return matches;
  } catch (error) {
    logBedrockCall(userProfile, false, error);
    throw error;
  }
};

/**
 * Log Bedrock API call for monitoring
 * @param {object} profile - User profile
 * @param {boolean} success - Whether call succeeded
 * @param {Error} error - Error object if failed
 */
const logBedrockCall = (profile, success, error = null) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    service: 'bedrock',
    success,
    profile: {
      acres: profile.acres,
      experience: profile.experience,
      state: profile.state
    }
  };
  
  if (error) {
    logEntry.error = error.message;
  }
  
  if (success) {
    console.log('✅ Bedrock API call successful:', JSON.stringify(logEntry));
  } else {
    console.warn('⚠️  Bedrock API call failed:', JSON.stringify(logEntry));
  }
};

module.exports = {
  callBedrock,
  buildPrompt,
  parseBedrockResponse,
  logBedrockCall,
  initializeBedrockClient
};

