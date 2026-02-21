# Design Document: Smart Farm Funding Matcher

## Overview

The Smart Farm Funding Matcher is a web application that matches Young, Beginning, and Small (YBS) row crop farmers with relevant USDA and state funding programs. The system uses a rule-based scoring algorithm to provide personalized funding recommendations based on farmer profiles.

### Core Capabilities

- **AI-Powered Matching Engine**: AWS Bedrock (Claude 3 Haiku) analyzes farmer profiles and generates intelligent match scores with explanations
- **Rule-Based Fallback**: Weighted scoring algorithm ensures continuous service when Bedrock is unavailable
- **Session Management**: JWT-based authentication with persistent sessions across browser sessions
- **Responsive Interface**: Mobile-first design supporting farmers accessing the system from various devices
- **Simple Data Storage**: In-memory storage for MVP (users and programs)

### Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3 (responsive design)
- **Backend**: Node.js with Express.js framework
- **AI Service**: AWS Bedrock with Claude 3 Haiku model
- **AWS SDK**: AWS SDK for JavaScript v3 (@aws-sdk/client-bedrock-runtime)
- **Authentication**: JWT tokens with bcrypt password hashing
- **Storage**: In-memory data store (users and programs)
- **Deployment**: Supports local development and cloud deployment (Render, Heroku, Railway)

## Architecture

### System Architecture

The application follows a simple client-server architecture with AWS Bedrock integration:

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   UI Layer   │  │  Auth State  │  │ Local Storage│      │
│  │  (HTML/CSS)  │  │  Management  │  │   (Session)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                           │                                  │
│                    ┌──────▼──────┐                          │
│                    │  API Client │                          │
│                    │  (fetch API)│                          │
│                    └──────┬──────┘                          │
└───────────────────────────┼─────────────────────────────────┘
                            │ HTTPS/JSON
┌───────────────────────────┼─────────────────────────────────┐
│                    ┌──────▼──────┐                          │
│                    │   Express   │                          │
│                    │   Router    │                          │
│                    └──────┬──────┘                          │
│                           │                                  │
│         ┌─────────────────┼─────────────────┐               │
│         │                 │                 │               │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐        │
│  │    Auth     │  │   Matching  │  │   Program   │        │
│  │   Service   │  │   Engine    │  │   Service   │        │
│  │             │  │             │  │             │        │
│  │  - Register │  │ - Bedrock   │  │ - Get All   │        │
│  │  - Login    │  │ - Fallback  │  │ - Filter    │        │
│  │  - JWT Gen  │  │ - Rank      │  │             │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                 │                 │               │
│         │          ┌──────▼──────┐          │               │
│         │          │   Bedrock   │          │               │
│         │          │   Service   │          │               │
│         │          │             │          │               │
│         │          │ - API Call  │          │               │
│         │          │ - Parse     │          │               │
│         │          │ - Timeout   │          │               │
│         │          └──────┬──────┘          │               │
│         │                 │                 │               │
│         └─────────────────┼─────────────────┘               │
│                           │                                  │
│                    ┌──────▼──────┐                          │
│                    │  In-Memory  │                          │
│                    │    Store    │                          │
│                    │             │                          │
│                    │ - Users[]   │                          │
│                    │ - Programs[]│                          │
│                    └─────────────┘                          │
│                     Server Layer                             │
└───────────────────────────┼─────────────────────────────────┘
                            │ AWS API
                            │ (HTTPS)
┌───────────────────────────▼─────────────────────────────────┐
│                      AWS Bedrock                             │
│                                                              │
│              Claude 3 Haiku Model                            │
│         (anthropic.claude-3-haiku-20240307-v1:0)            │
│                                                              │
│  - Analyzes farmer profile + program list                   │
│  - Returns scored matches with explanations                 │
│  - JSON response format                                     │
└─────────────────────────────────────────────────────────────┘
```

### Matching Engine Flow

The matching engine uses AWS Bedrock for AI-powered scoring with rule-based fallback:

```
┌─────────────────────────────────────────────────────────────┐
│                    Matching Pipeline                         │
│                                                              │
│  ┌──────────────┐                                           │
│  │ User Profile │                                           │
│  │   Input      │                                           │
│  └──────┬───────┘                                           │
│         │                                                    │
│         ▼                                                    │
│  ┌──────────────────────────────────────────┐              │
│  │      Try AWS Bedrock Service             │              │
│  │                                           │              │
│  │  1. Build prompt with profile + programs │              │
│  │  2. Call Bedrock API (30s timeout)       │              │
│  │  3. Parse JSON response                  │              │
│  └──────┬───────────────────────┬───────────┘              │
│         │ Success               │ Failure/Timeout          │
│         ▼                       ▼                           │
│  ┌──────────────┐        ┌──────────────┐                 │
│  │   Bedrock    │        │  Rule-Based  │                 │
│  │   Results    │        │   Fallback   │                 │
│  │              │        │              │                 │
│  │ - AI Scores  │        │ - Experience │  (30 pts)       │
│  │ - AI Reasons │        │ - Farm Size  │  (20 pts)       │
│  └──────┬───────┘        │ - State      │  (15 pts)       │
│         │                │ - Type       │  (20 pts)       │
│         │                │ - Purpose    │  (25 pts)       │
│         │                │ - Bonuses    │  (10-15 pts)    │
│         │                └──────┬───────┘                  │
│         │                       │                           │
│         └───────────┬───────────┘                           │
│                     ▼                                        │
│              ┌──────────────┐                               │
│              │   Filter     │                               │
│              │ (score ≥ 30) │                               │
│              └──────┬───────┘                               │
│                     │                                        │
│                     ▼                                        │
│              ┌──────────────┐                               │
│              │     Sort     │                               │
│              │ (by score)   │                               │
│              └──────┬───────┘                               │
│                     │                                        │
│                     ▼                                        │
│              ┌──────────────┐                               │
│              │   Ranked     │                               │
│              │   Results    │                               │
│              └──────────────┘                               │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Registration/Login Flow**:
   - User submits credentials → Auth Service validates → JWT generated → Token + profile stored in localStorage → Session restored on page load

2. **Matching Flow**:
   - User profile submitted → Scoring Engine calculates weighted scores for each program → Filter programs with score ≥ 30 → Sort by score descending → Generate match reasons → Return ranked programs

## Components and Interfaces

### Frontend Components

#### 1. Authentication UI
**Responsibility**: Handle user registration and login

**Interface**:
```javascript
// Registration form submission
{
  email: string,
  password: string,
  acres: number,
  experience: number,
  state: "SC" | "NC" | "GA",
  farmerType: Array<"young" | "beginning" | "small">,
  purposes: Array<"equipment" | "operating_costs" | "land_purchase" | "irrigation">
}

// Login form submission
{
  email: string,
  password: string
}
```

**State Management**:
- Stores JWT token in localStorage
- Stores user profile in localStorage
- Manages authentication state across page loads

#### 2. Profile Form Component
**Responsibility**: Collect and validate farmer profile information

**Validation Rules**:
- Acres: positive number
- Experience: non-negative number
- State: must be one of SC, NC, GA
- Farmer Type: at least one selection
- Purposes: at least one selection

#### 3. Results Display Component
**Responsibility**: Render matched programs with explanations (AI-generated from Bedrock or rule-based)

**Display Elements**:
- Best Pick badge (🏆 BEST MATCH)
- Match percentage
- Program details (name, agency, type, amount, deadline)
- Match reasons (prioritized list from Bedrock or rule-based)
- Call-to-action button (link to official program)

#### 4. Session Manager
**Responsibility**: Persist and restore user sessions

**Methods**:
```javascript
saveSession(token, user)
loadSession() → {token, user} | null
clearSession()
isAuthenticated() → boolean
```

### Backend Components

#### 1. Authentication Service

**Endpoints**:
```
POST /api/register
POST /api/login
```

**Methods**:
```javascript
async register(email, password, farmProfile) → {message}
async login(email, password) → {token, user}
generateJWT(userId) → string
hashPassword(password) → string
comparePassword(password, hash) → boolean
```

**Security**:
- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens signed with secret key
- Password field excluded from API responses

#### 2. Matching Engine (AI-Powered with Fallback)

**Endpoint**:
```
POST /api/match
```

**Primary Algorithm (AWS Bedrock)**:
```javascript
async callBedrockForMatching(userProfile, programs) → {
  matches: Array<{
    programId: number,
    score: number,
    reasons: string[]
  }>
}
```

**Fallback Algorithm (Rule-Based)**:
```javascript
calculateMatchScore(userProfile, program) → {
  score: number,        // 0-100+
  percentage: number,   // 0-100
  reasons: string[]     // Generated explanations
}
```

**Bedrock Integration Flow**:
1. Receive user profile from POST /api/match
2. Attempt Bedrock API call with 30-second timeout
3. If successful, parse JSON response and return AI-scored matches
4. If failed/timeout, fall back to rule-based scoring
5. Filter results (score ≥ 30)
6. Sort by score descending
7. Return ranked matches

**Scoring Criteria** (Rule-Based Fallback - Weighted):
- Experience Match: 30 points (range check: minExperience ≤ user ≤ maxExperience)
- Farm Size Match: 20 points (range check: minAcres ≤ user ≤ maxAcres)
- State Location: 15 points (state in program.states array)
- Farmer Type: 20 points (10 points per matching type)
- Funding Purposes: 25 points (12 points per matching purpose)
- Grant Bonus: 10 points (grant/payment programs)
- Deadline Urgency: 5 points (within 60 days)
- Fast Approval: 5 points (2-3 week processing)

#### 3. Program Service

**Endpoint**:
```
GET /api/programs
```

**Methods**:
```javascript
getAllPrograms() → Program[]
```

#### 4. Bedrock Service

**Responsibility**: Interface with AWS Bedrock API for AI-powered matching

**Configuration**:
```javascript
// Environment variables
AWS_ACCESS_KEY_ID: string       // AWS access key
AWS_SECRET_ACCESS_KEY: string   // AWS secret key
AWS_REGION: string              // AWS region (default: us-east-1)
BEDROCK_MODEL_ID: string        // Model identifier (default: anthropic.claude-3-haiku-20240307-v1:0)
BEDROCK_TIMEOUT: number         // API timeout in ms (default: 30000)
```

**AWS SDK Setup**:
```javascript
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
```

**API Call Structure**:
```javascript
async callBedrock(userProfile, programs) {
  const prompt = buildPrompt(userProfile, programs);
  
  const params = {
    modelId: process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0',
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
  const response = await bedrockClient.send(command);
  
  return parseBedrockResponse(response);
}
```

**Prompt Format**:
```
You are a funding matching expert for farmers. Analyze the farmer profile and score each program from 0-100 based on how well it matches their needs.

Farmer Profile:
- Farm Size: {acres} acres
- Experience: {experience} years
- State: {state}
- Farmer Types: {farmerType.join(', ')}
- Funding Needs: {purposes.join(', ')}

Programs:
{programs.map(p => `
ID: ${p.id}
Name: ${p.name}
Agency: ${p.agency}
Type: ${p.type}
Max Amount: ${p.maxAmount}
Eligibility: ${p.minExperience}-${p.maxExperience} years, ${p.minAcres}-${p.maxAcres} acres
States: ${p.states.join(', ')}
Farmer Types: ${p.farmerTypes.join(', ')}
Purposes: ${p.purposes.join(', ')}
Deadline: ${p.deadline}
`).join('\n---\n')}

Return a JSON array with this exact structure:
[
  {
    "programId": <number>,
    "score": <number 0-100>,
    "reasons": [<array of 2-5 specific reasons why this program matches>]
  }
]

Score based on: experience match, farm size match, state availability, farmer type alignment, funding purpose match, program benefits, and deadline urgency.
```

**Response Parsing**:
```javascript
function parseBedrockResponse(response) {
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  const content = responseBody.content[0].text;
  
  // Extract JSON from response (may be wrapped in markdown code blocks)
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('Invalid Bedrock response format');
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
}
```

**Error Handling**:
- Timeout after 30 seconds → fall back to rule-based
- Invalid credentials → log error, fall back to rule-based
- Malformed response → log error, fall back to rule-based
- Network errors → log error, fall back to rule-based
- Rate limiting → log error, fall back to rule-based

**Logging**:
```javascript
function logBedrockCall(profile, success, error = null) {
  console.log({
    timestamp: new Date().toISOString(),
    service: 'bedrock',
    success,
    error: error?.message,
    profile: { acres: profile.acres, experience: profile.experience, state: profile.state }
  });
}
```

#### 5. In-Memory Store

**Data Structures**:
```javascript
// Users array
users: Array<{
  id: number,
  email: string,
  password: string,  // bcrypt hashed
  farmProfile: {
    acres: number,
    experience: number,
    state: string,
    farmerType: string[],
    purposes: string[]
  }
}>

// Programs array
programs: Array<{
  id: number,
  name: string,
  agency: string,
  maxAmount: string,
  type: string,
  interestRate: string,
  minExperience: number,
  maxExperience: number,
  minAcres: number,
  maxAcres: number,
  states: string[],
  farmerTypes: string[],
  purposes: string[],
  deadline: string,
  applicationTime: string,
  reason: string,
  benefits: string[],
  url: string
}>
```

## AWS Configuration

### Environment Variables

The system requires the following environment variables for AWS Bedrock integration:

```bash
# Required for Bedrock
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1  # or your preferred region

# Optional Bedrock configuration
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
BEDROCK_TIMEOUT=30000  # milliseconds

# Application configuration
JWT_SECRET=your_jwt_secret
PORT=3000
NODE_ENV=production
```

### AWS IAM Permissions

The AWS credentials must have the following IAM permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": [
        "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-haiku-20240307-v1:0"
      ]
    }
  ]
}
```

### Bedrock Model Selection

For MVP, we use Claude 3 Haiku for cost-effectiveness and speed:

- **Model**: anthropic.claude-3-haiku-20240307-v1:0
- **Rationale**: Fast responses, low cost, sufficient intelligence for matching
- **Max Tokens**: 4096 (sufficient for scoring 8-10 programs)
- **Pricing**: ~$0.00025 per 1K input tokens, ~$0.00125 per 1K output tokens

### Deployment Considerations

1. **Environment Setup**:
   - Set AWS credentials as environment variables (never commit to code)
   - Use AWS IAM roles when deploying to AWS services (EC2, ECS, Lambda)
   - For local development, use `.env` file (add to `.gitignore`)

2. **Fallback Mode**:
   - System works without AWS credentials (uses rule-based scoring)
   - Useful for development and testing without AWS costs
   - Set `AWS_ACCESS_KEY_ID=""` to force fallback mode

3. **Cost Management**:
   - Each match request costs approximately $0.001-0.002
   - Monitor usage via AWS CloudWatch
   - Consider caching results for identical profiles (future enhancement)

4. **Regional Availability**:
   - Claude 3 Haiku available in: us-east-1, us-west-2, eu-west-1, ap-southeast-1
   - Choose region closest to your users for lower latency

## Data Models

### User Model

```javascript
{
  id: number,              // Unique identifier (timestamp-based)
  email: string,           // Unique, required
  password: string,        // Bcrypt hashed, never returned in API
  farmProfile: {
    acres: number,         // Farm size in acres
    experience: number,    // Years of farming experience
    state: string,         // SC, NC, or GA
    farmerType: string[],  // ["young", "beginning", "small"]
    purposes: string[]     // ["equipment", "operating_costs", etc.]
  }
}
```

**Validation Rules**:
- Email: valid email format, unique
- Password: minimum 6 characters (hashed with bcrypt)
- Acres: positive number
- Experience: non-negative number
- State: enum ["SC", "NC", "GA"]
- FarmerType: non-empty array, valid values
- Purposes: non-empty array, valid values

### Program Model

```javascript
{
  id: number,                    // Unique identifier
  name: string,                  // Program name
  agency: string,                // Administering agency
  maxAmount: string,             // Maximum funding amount
  type: string,                  // Loan, Grant, Cost-share Grant, etc.
  interestRate: string,          // Interest rate (N/A for grants)
  
  // Eligibility criteria
  minExperience: number,         // Minimum years experience
  maxExperience: number,         // Maximum years experience
  minAcres: number,              // Minimum farm size
  maxAcres: number,              // Maximum farm size
  states: string[],              // Available states
  farmerTypes: string[],         // Priority farmer types
  purposes: string[],            // Supported funding purposes
  
  // Application details
  deadline: string,              // Application deadline
  applicationTime: string,       // Estimated processing time
  benefits: string[],            // Key benefits list
  url: string,                   // Official program URL
  
  // Description for AI context
  reason: string                 // Base description used in Bedrock prompts
}
```

### Match Result Model

```javascript
{
  ...program,                    // All program fields
  matchScore: number,            // Raw score (0-100+)
  matchPercentage: number,       // Normalized percentage (0-100)
  matchReasons: string[],        // AI-generated (Bedrock) or rule-based explanations
  isBestPick: boolean            // Identified as best match
}
```

### API Request/Response Models

#### POST /api/register
**Request**:
```javascript
{
  email: string,
  password: string,
  acres: number,
  experience: number,
  state: string,
  farmerType: string[],
  purposes: string[]
}
```

**Response** (Success):
```javascript
{
  message: "Registered successfully"
}
```

**Response** (Error):
```javascript
{
  message: "User already exists" | "Registration failed",
  error: string  // Optional error details
}
```

#### POST /api/login
**Request**:
```javascript
{
  email: string,
  password: string
}
```

**Response** (Success):
```javascript
{
  token: string,  // JWT token
  user: {
    id: number,
    email: string,
    farmProfile: object
    // password excluded
  }
}
```

**Response** (Error):
```javascript
{
  message: "User not found" | "Invalid password" | "Login failed",
  error: string  // Optional error details
}
```

#### POST /api/match
**Request**:
```javascript
{
  acres: number,
  experience: number,
  state: string,
  farmerType: string[],
  purposes: string[]
}
```

**Response** (Success):
```javascript
[
  {
    ...program,
    matchScore: number,
    matchPercentage: number,
    matchReasons: string[]
  }
]
// Sorted by matchScore descending
// Filtered to matchScore >= 30
```

#### GET /api/programs
**Response**:
```javascript
[
  {
    id: number,
    name: string,
    agency: string,
    // ... all program fields
  }
]
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified several areas of redundancy:

1. **Scoring criteria properties (3.4-3.9)** can be consolidated into a single comprehensive property about the scoring algorithm applying all weighted criteria correctly
2. **Display properties (8.1-8.11)** can be consolidated into properties about complete program information display
3. **Session persistence properties (9.1-9.6)** overlap significantly with authentication properties (1.5-1.7) and can be consolidated
4. **Profile field collection (2.1-2.7)** are all UI examples that can be tested together
5. **Match reason generation (4.2-4.9)** can be consolidated into a single property about generating reasons for all matching criteria

The following properties represent the unique, non-redundant correctness requirements:

### Authentication and Security Properties

### Property 1: Registration creates hashed accounts

*For any* valid user registration data (email, password, farm profile), the system should create a new user account with the password hashed using bcrypt, and all profile attributes should be persisted in the Profile_Store.

**Validates: Requirements 1.1, 2.8, 14.1, 14.2**

### Property 2: Invalid credentials return errors

*For any* login attempt with invalid credentials (non-existent email or incorrect password), the Authentication_Service should return an appropriate error message without revealing which credential was invalid.

**Validates: Requirements 1.4**

### Property 3: Valid login generates JWT and returns sanitized profile

*For any* valid login credentials, the Authentication_Service should generate a JWT token, return the user profile with the password field excluded, and store both token and profile in browser localStorage.

**Validates: Requirements 1.3, 1.5, 9.1, 9.2, 14.5**

### Property 4: Session restoration from localStorage

*For any* application load where valid authentication data exists in localStorage, the system should automatically restore the user session and display matching programs without requiring re-login.

**Validates: Requirements 1.6, 9.3, 9.4, 9.5**

### Property 5: Logout clears all session data

*For any* authenticated user who clicks logout, the system should clear the JWT token and user profile from localStorage, effectively ending the session.

**Validates: Requirements 1.7, 9.6**

### Property 6: Password security round-trip

*For any* user registration followed by login with the same credentials, the bcrypt comparison should succeed, demonstrating that passwords are hashed during registration and securely compared during login.

**Validates: Requirements 14.1, 14.3**

### Property 7: Input validation before processing

*For any* user input submitted to the system, validation should occur before processing, rejecting invalid inputs with appropriate error messages.

**Validates: Requirements 14.7**

### Matching Engine Properties

### Property 8: Match score calculation for all programs

*For any* user profile submitted to the matching engine, a match score should be calculated for every program in the database using either AWS Bedrock AI scoring (primary) or rule-based scoring (fallback).

**Validates: Requirements 4.1, 4.7**

### Property 9: Multi-criteria weighted scoring (fallback mode)

*For any* user profile and program pair when using rule-based fallback, the match score should incorporate all weighted criteria: experience level (up to 30 points), farm size (up to 20 points), state location (up to 15 points), farmer type (up to 20 points), and funding purposes (up to 25 points), plus applicable bonuses.

**Validates: Requirements 4.9, 4.10, 4.11, 4.12, 4.13, 4.14, 4.15, 4.16, 4.17**

### Property 10: Match percentage calculation and capping

*For any* calculated match score (from Bedrock or rule-based), the match percentage should be computed as (score / 100) * 100 and capped at 100%, ensuring percentages never exceed the maximum.

**Validates: Requirements 4.4**

### Property 11: Threshold filtering of low matches

*For any* set of scored programs (from Bedrock or rule-based), programs with match scores below the relevance threshold (currently 30 points) should be excluded from the results.

**Validates: Requirements 4.5**

### Property 12: Score-based ranking

*For any* set of matching programs (from Bedrock or rule-based), they should be ranked in descending order by match score, with the highest-scoring program appearing first.

**Validates: Requirements 4.6**

### Property 13: Best pick identification

*For any* non-empty set of matching programs (from Bedrock or rule-based), exactly one program should be identified as the Best_Pick (the highest-scoring program), positioned first in the results list, and marked with the "🏆 BEST MATCH" badge.

**Validates: Requirements 6.1, 6.2, 6.5**

### Match Explanation Properties

### Property 14: AI-generated explanations from Bedrock

*For any* program scored by AWS Bedrock, the system should use the AI-generated natural language explanations provided by Bedrock to describe why the program matches the farmer profile.

**Validates: Requirements 5.1, 5.2, 5.3**

### Property 15: Rule-based explanation generation for matching criteria (fallback mode)

*For any* program that scores points in a criterion when using rule-based fallback (experience, size, state, farmer type, funding purpose, grant bonus, deadline urgency, or fast approval), the system should generate a corresponding explanation reason describing why that criterion matched.

**Validates: Requirements 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11, 5.12**

### Property 16: Complete match reasons display

*For any* matched program (from Bedrock or rule-based), all generated match reasons should be displayed as a bulleted list in the UI.

**Validates: Requirements 5.3**

### AWS Bedrock Integration Properties

### Property 17: Bedrock API call structure

*For any* matching request, when AWS Bedrock is available, the system should construct a properly formatted API call including the farmer profile, program list, and structured prompt requesting JSON-formatted scored matches with explanations.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

### Property 18: Bedrock response parsing and validation

*For any* response received from AWS Bedrock, the system should parse the JSON response, validate the structure (programId, score, reasons array), and reject malformed responses by falling back to rule-based scoring.

**Validates: Requirements 3.4, 4.8**

### Property 19: Bedrock timeout and fallback

*For any* Bedrock API call that exceeds the configured timeout (default 30 seconds) or fails due to credentials, network, or service errors, the system should automatically fall back to rule-based scoring without user-visible errors.

**Validates: Requirements 3.3, 3.6, 4.7, 4.8**

### Data Persistence Properties

### Property 20: Complete program data storage

*For any* program in the Profile_Store, all required attributes should be present: name, agency, maxAmount, type, interestRate, eligibility criteria (experience range, acreage limits, states), farmer type priorities, funding purposes, deadline, applicationTime, benefits, and URL.

**Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5**

### API Contract Properties

### Property 21: Registration API response format

*For any* successful registration request to POST /api/register, the response should be JSON format with a success message; for failed registrations, the response should include an error message explaining the failure.

**Validates: Requirements 12.1, 12.5, 11.2**

### Property 22: Login API response format

*For any* successful login request to POST /api/login, the response should be JSON format containing a JWT token and user profile (with password excluded); for failed logins, the response should include an error message.

**Validates: Requirements 12.2, 12.6, 11.3**

### Property 23: Match API response format

*For any* match request to POST /api/match, the response should be JSON format containing an array of programs, each with matchScore, matchPercentage, and matchReasons, sorted by score descending.

**Validates: Requirements 12.3, 12.7**

### Property 24: HTTP status code correctness

*For any* API request, the response should include the appropriate HTTP status code: 200 for success, 400 for client errors (invalid input, duplicate email), 500 for server errors.

**Validates: Requirements 12.9**

### User Feedback Properties

### Property 25: Success message display

*For any* successful operation (registration, login), the system should display a success message to the user that automatically dismisses after 5 seconds.

**Validates: Requirements 11.1, 11.6**

### Property 26: Error message display

*For any* failed operation (registration, login, network error), the system should display an error message explaining the failure that automatically dismisses after 5 seconds.

**Validates: Requirements 11.2, 11.3, 11.5, 11.6**

### Program Display Properties

### Property 27: Complete program information display

*For any* matching program displayed in the UI, all essential information should be shown: name, agency, type, maxAmount, deadline, applicationTime, benefits list, match reasons, and a clickable link to the official website. For loan programs, the interest rate should also be displayed.

**Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10**

### AWS Bedrock Monitoring Properties

### Property 28: Bedrock call logging

*For any* matching operation, the system should log whether Bedrock was used successfully or if fallback to rule-based scoring occurred, including error details for failed Bedrock calls.

**Validates: Requirements 3.3, 4.7, 4.8**

### Property 29: Fallback to rule-based matching

*For any* matching request where AWS Bedrock fails, times out, or is unavailable, the system should fall back to rule-based matching to ensure continuous service availability.

**Validates: Requirements 4.7, 4.8**

### Property 30: Privacy-preserving data handling

*For any* user profile data sent to AWS Bedrock, only the necessary matching attributes (acres, experience, state, farmerType, purposes) should be included, excluding personally identifiable information like email or password.

**Validates: Requirements 13.7**

## Error Handling

### Error Categories

The system handles five primary categories of errors:

1. **Authentication Errors**
   - Duplicate email during registration
   - Invalid credentials during login
   - Expired or invalid JWT tokens
   - Missing authentication data

2. **Validation Errors**
   - Invalid email format
   - Password too short
   - Invalid numeric values (negative acres, experience)
   - Invalid enum values (state, farmerType, purposes)
   - Missing required fields

3. **Network Errors**
   - API request failures
   - Timeout errors
   - Connection errors
   - Server unavailability

4. **AWS Bedrock Errors**
   - Invalid AWS credentials
   - Bedrock API timeout (>30s)
   - Rate limiting / throttling
   - Malformed Bedrock response
   - Model unavailability
   - Region configuration errors

5. **System Errors**
   - Database operation failures
   - Unexpected exceptions
   - Resource exhaustion

### Error Handling Strategy

#### Frontend Error Handling

```javascript
// API call wrapper with error handling
async function apiCall(endpoint, options) {
  try {
    const response = await fetch(endpoint, options);
    const data = await response.json();
    
    if (!response.ok) {
      // Handle HTTP error status codes
      throw new Error(data.message || 'Request failed');
    }
    
    return data;
  } catch (error) {
    // Network or parsing errors
    if (error.name === 'TypeError') {
      showError('Network error. Please check your connection.');
    } else {
      showError(error.message);
    }
    throw error;
  }
}

// User feedback display
function showError(message) {
  // Display error prominently
  // Auto-dismiss after 5 seconds
  setTimeout(() => dismissError(), 5000);
}

function showSuccess(message) {
  // Display success message
  // Auto-dismiss after 5 seconds
  setTimeout(() => dismissSuccess(), 5000);
}
```

#### Backend Error Handling

```javascript
// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Determine appropriate status code
  const statusCode = err.statusCode || 500;
  
  // Send error response
  res.status(statusCode).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Route-specific error handling
app.post('/api/register', async (req, res) => {
  try {
    // Validation
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }
    
    // Check for duplicate
    if (users.find(u => u.email === req.body.email)) {
      return res.status(400).json({ 
        message: 'User already exists' 
      });
    }
    
    // Process registration
    // ...
    
  } catch (error) {
    res.status(500).json({ 
      message: 'Registration failed', 
      error: error.message 
    });
  }
});
```

### AI Component Error Handling

```javascript
// Matching engine with Bedrock and fallback
async function calculateMatches(profile) {
  try {
    // Attempt AWS Bedrock matching
    const bedrockMatches = await callBedrockForMatching(profile, programs);
    logBedrockCall(profile, true);
    return bedrockMatches;
  } catch (error) {
    console.error('Bedrock matching failed, falling back to rule-based:', error);
    
    // Log failure for monitoring
    logBedrockCall(profile, false, error);
    
    // Fallback to rule-based matching
    return ruleBasedMatching(profile, programs);
  }
}

// Bedrock API call with timeout
async function callBedrockForMatching(profile, programs) {
  const timeout = parseInt(process.env.BEDROCK_TIMEOUT) || 30000;
  
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Bedrock API timeout')), timeout);
  });
  
  const bedrockPromise = callBedrock(profile, programs);
  
  try {
    const result = await Promise.race([bedrockPromise, timeoutPromise]);
    return result;
  } catch (error) {
    // Specific error handling
    if (error.name === 'CredentialsError') {
      console.error('AWS credentials invalid or missing');
    } else if (error.name === 'ThrottlingException') {
      console.error('Bedrock API rate limit exceeded');
    } else if (error.message === 'Bedrock API timeout') {
      console.error('Bedrock API call exceeded 30 second timeout');
    }
    throw error;
  }
}

// Rule-based fallback (always available)
function ruleBasedMatching(profile, programs) {
  return programs.map(program => {
    const result = calculateMatchScore(profile, program);
    return {
      ...program,
      matchScore: result.score,
      matchPercentage: result.percentage,
      matchReasons: result.reasons
    };
  })
  .filter(m => m.matchScore >= 30)
  .sort((a, b) => b.matchScore - a.matchScore);
}
```

### Validation Error Messages

The system provides specific, actionable error messages:

- **"User already exists"** - Email is already registered
- **"User not found"** - Email not in system
- **"Invalid password"** - Password doesn't match
- **"Email and password are required"** - Missing required fields
- **"Invalid email format"** - Email doesn't match pattern
- **"Acres must be a positive number"** - Invalid farm size
- **"Experience must be non-negative"** - Invalid experience value
- **"State must be SC, NC, or GA"** - Invalid state selection
- **"At least one farmer type required"** - Empty farmer type array
- **"At least one funding purpose required"** - Empty purposes array

### Error Recovery

1. **Session Recovery**: If JWT token expires, redirect to login with message "Session expired, please log in again"

2. **Network Retry**: For transient network errors, implement exponential backoff retry (3 attempts)

3. **Partial Failure**: If some programs fail to score, continue with successfully scored programs and log failures

4. **Data Validation**: Validate all inputs before processing, reject invalid data early with clear messages

## Testing Strategy

### Dual Testing Approach

The Smart Farm Funding Matcher requires both unit testing and property-based testing to ensure comprehensive correctness:

- **Unit Tests**: Verify specific examples, edge cases, error conditions, and integration points
- **Property Tests**: Verify universal properties across all inputs using randomized testing

Both approaches are complementary and necessary. Unit tests catch concrete bugs and validate specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Property-Based Testing Configuration

**Library Selection**: 
- **JavaScript/Node.js**: Use `fast-check` library for property-based testing
- Installation: `npm install --save-dev fast-check`

**Test Configuration**:
- Minimum 100 iterations per property test (due to randomization)
- Each property test must reference its design document property
- Tag format: `// Feature: farm-funding-matcher-documentation, Property {number}: {property_text}`

**Example Property Test Structure**:

```javascript
const fc = require('fast-check');

// Feature: farm-funding-matcher-documentation, Property 1: Registration creates hashed accounts
test('Property 1: Registration creates hashed accounts', () => {
  fc.assert(
    fc.property(
      fc.emailAddress(),
      fc.string({ minLength: 6 }),
      fc.integer({ min: 1, max: 10000 }),
      fc.integer({ min: 0, max: 50 }),
      fc.constantFrom('SC', 'NC', 'GA'),
      fc.array(fc.constantFrom('young', 'beginning', 'small'), { minLength: 1 }),
      fc.array(fc.constantFrom('equipment', 'operating_costs', 'land_purchase', 'irrigation'), { minLength: 1 }),
      async (email, password, acres, experience, state, farmerType, purposes) => {
        // Register user
        const result = await register(email, password, acres, experience, state, farmerType, purposes);
        
        // Verify account created
        const user = users.find(u => u.email === email);
        expect(user).toBeDefined();
        
        // Verify password is hashed (not plain text)
        expect(user.password).not.toBe(password);
        expect(user.password).toMatch(/^\$2[aby]\$/); // bcrypt hash pattern
        
        // Verify all profile attributes persisted
        expect(user.farmProfile.acres).toBe(acres);
        expect(user.farmProfile.experience).toBe(experience);
        expect(user.farmProfile.state).toBe(state);
        expect(user.farmProfile.farmerType).toEqual(farmerType);
        expect(user.farmProfile.purposes).toEqual(purposes);
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: farm-funding-matcher-documentation, Property 9: Multi-criteria weighted scoring (fallback mode)
test('Property 9: Multi-criteria weighted scoring (fallback mode)', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 1, max: 10000 }),
      fc.integer({ min: 0, max: 50 }),
      fc.constantFrom('SC', 'NC', 'GA'),
      fc.array(fc.constantFrom('young', 'beginning', 'small'), { minLength: 1 }),
      fc.array(fc.constantFrom('equipment', 'operating_costs', 'land_purchase', 'irrigation'), { minLength: 1 }),
      (acres, experience, state, farmerType, purposes) => {
        const profile = { acres, experience, state, farmerType, purposes };
        const program = programs[0]; // Test with first program
        
        // Force rule-based scoring (bypass Bedrock)
        const result = calculateMatchScore(profile, program);
        
        // Verify score is within valid range
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(110); // Max 100 + bonuses
        
        // Verify all criteria were considered
        let expectedScore = 0;
        
        if (experience >= program.minExperience && experience <= program.maxExperience) {
          expectedScore += 30;
        }
        if (acres >= program.minAcres && acres <= program.maxAcres) {
          expectedScore += 20;
        }
        if (program.states.includes(state)) {
          expectedScore += 15;
        }
        // ... verify other criteria
        
        expect(result.score).toBe(expectedScore);
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: farm-funding-matcher-documentation, Property 19: Bedrock timeout and fallback
test('Property 19: Bedrock timeout and fallback', async () => {
  const profile = { 
    acres: 100, 
    experience: 5, 
    state: 'SC', 
    farmerType: ['beginning'], 
    purposes: ['equipment'] 
  };
  
  // Mock Bedrock to timeout
  jest.spyOn(global, 'callBedrock').mockImplementation(() => 
    new Promise((resolve) => setTimeout(resolve, 35000))
  );
  
  const matches = await calculateMatches(profile);
  
  // Should still return results via fallback
  expect(matches).toBeDefined();
  expect(Array.isArray(matches)).toBe(true);
  expect(matches.length).toBeGreaterThan(0);
  
  // Verify fallback was used (check for rule-based scoring characteristics)
  expect(matches[0].matchScore).toBeDefined();
  expect(matches[0].matchReasons).toBeDefined();
});
```

### Unit Testing Strategy

Unit tests focus on:

1. **Specific Examples**:
   - Duplicate email registration returns error
   - Empty match results show appropriate message
   - Best pick badge displays correctly
   - Bedrock response parsing with valid JSON
   - Bedrock response parsing with malformed JSON

2. **Edge Cases**:
   - Zero acres or experience
   - Maximum values for numeric fields
   - Empty arrays for farmerType or purposes
   - Programs with no matching criteria
   - Deadlines in the past
   - Bedrock timeout exactly at 30 seconds
   - Bedrock returns empty results array

3. **Error Conditions**:
   - Invalid email format
   - Password too short
   - Network failures
   - AWS Bedrock failures (credentials, timeout, throttling)
   - Missing required fields
   - Invalid AWS region configuration

4. **Integration Points**:
   - API endpoint responses
   - localStorage operations
   - JWT token generation and validation
   - bcrypt hashing and comparison
   - AWS SDK Bedrock client initialization
   - Bedrock API call and response handling

**Example Unit Tests**:

```javascript
// Specific example: Duplicate email
test('Duplicate email registration returns error', async () => {
  await register('test@example.com', 'password123', 100, 5, 'SC', ['beginning'], ['equipment']);
  
  const result = await register('test@example.com', 'different', 200, 3, 'NC', ['young'], ['land_purchase']);
  
  expect(result.message).toBe('User already exists');
});

// Edge case: Zero experience
test('Zero experience is valid for beginning farmers', async () => {
  const profile = { acres: 50, experience: 0, state: 'SC', farmerType: ['beginning'], purposes: ['equipment'] };
  
  const matches = await calculateMatches(profile);
  
  expect(matches.length).toBeGreaterThan(0);
  expect(matches.some(m => m.minExperience === 0)).toBe(true);
});

// Error condition: Invalid email
test('Invalid email format returns validation error', async () => {
  const result = await register('not-an-email', 'password123', 100, 5, 'SC', ['beginning'], ['equipment']);
  
  expect(result.message).toContain('Invalid email format');
});

// Integration: JWT token validation
test('Valid JWT token allows access to protected routes', async () => {
  const { token } = await login('test@example.com', 'password123');
  
  const response = await fetch('/api/match', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  expect(response.status).toBe(200);
});

// Bedrock integration: Valid response parsing
test('Bedrock valid JSON response is parsed correctly', () => {
  const mockResponse = {
    body: new TextEncoder().encode(JSON.stringify({
      content: [{
        text: JSON.stringify([
          { programId: 1, score: 85, reasons: ["Great match", "Perfect fit"] },
          { programId: 2, score: 70, reasons: ["Good option"] }
        ])
      }]
    }))
  };
  
  const result = parseBedrockResponse(mockResponse);
  
  expect(result).toHaveLength(2);
  expect(result[0].programId).toBe(1);
  expect(result[0].score).toBe(85);
  expect(result[0].reasons).toEqual(["Great match", "Perfect fit"]);
});

// Bedrock integration: Malformed response triggers fallback
test('Bedrock malformed response triggers fallback', async () => {
  jest.spyOn(global, 'callBedrock').mockRejectedValue(new Error('Invalid response format'));
  
  const profile = { acres: 100, experience: 5, state: 'SC', farmerType: ['beginning'], purposes: ['equipment'] };
  const matches = await calculateMatches(profile);
  
  // Should still return results via fallback
  expect(matches).toBeDefined();
  expect(matches.length).toBeGreaterThan(0);
});

// Bedrock integration: AWS credentials error
test('Invalid AWS credentials triggers fallback', async () => {
  jest.spyOn(global, 'callBedrock').mockRejectedValue({ name: 'CredentialsError' });
  
  const profile = { acres: 100, experience: 5, state: 'SC', farmerType: ['beginning'], purposes: ['equipment'] };
  const matches = await calculateMatches(profile);
  
  // Should fall back gracefully
  expect(matches).toBeDefined();
  expect(matches.length).toBeGreaterThan(0);
});
```

### Test Coverage Goals

- **Unit Test Coverage**: Minimum 80% code coverage
- **Property Test Coverage**: All 30 correctness properties implemented
- **Integration Test Coverage**: All API endpoints tested (including Bedrock integration)
- **E2E Test Coverage**: Critical user flows (registration → login → matching)
- **Bedrock Mock Coverage**: Test both successful Bedrock calls and fallback scenarios

### Testing Tools

- **Unit Testing**: Jest or Mocha
- **Property Testing**: fast-check
- **API Testing**: Supertest
- **E2E Testing**: Playwright or Cypress
- **Coverage**: Istanbul/nyc
- **AWS Mocking**: aws-sdk-mock or Jest mocks for Bedrock client

### Continuous Testing

- Run unit tests on every commit
- Run property tests on pull requests
- Run integration tests before deployment
- Monitor test execution time (property tests may be slower due to 100+ iterations)

