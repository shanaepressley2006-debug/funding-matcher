# Implementation Plan: Smart Farm Funding Matcher

## Overview

This implementation plan breaks down the Smart Farm Funding Matcher into discrete coding tasks. The system is an AI-powered web application that uses AWS Bedrock (Claude 3 Haiku) for intelligent matching with rule-based fallback. The implementation follows a layered approach: data models and storage, backend services (authentication, Bedrock integration, matching engine), API endpoints, frontend UI components, and comprehensive testing.

This is an MVP focused on simple Bedrock API integration with robust fallback - no complex ML pipelines, NLP processors, or adaptive learning systems.

## Tasks

- [x] 1. Set up project structure and dependencies
  - Install required npm packages: express, bcrypt, jsonwebtoken, cors, dotenv
  - Install AWS SDK: @aws-sdk/client-bedrock-runtime
  - Install testing dependencies: jest, supertest, fast-check
  - Create directory structure for organized code (services/, models/, utils/, tests/)
  - Set up environment variables configuration (.env file with JWT_SECRET, PORT, AWS credentials, BEDROCK_MODEL_ID, BEDROCK_TIMEOUT)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 13.4_

- [x] 2. Implement data models and storage layer
  - [x] 2.1 Create in-memory Profile Store with user and program collections
    - Define users array structure with id, email, password, farmProfile, createdAt
    - Define programs array structure with all required attributes (id, name, agency, eligibility criteria, etc.)
    - Implement helper functions: findUserByEmail, findUserById, addUser, getAllPrograms
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [ ]* 2.2 Write property test for data model integrity
    - **Property 20: Complete program data storage**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5**
  
  - [x] 2.3 Seed initial program database with 8+ diverse funding programs
    - Include USDA FSA Direct Operating Loans, Microloans, Beginning Farmer Loans
    - Include state programs (SC, NC, GA) with varied eligibility criteria
    - Include grants, loans, cost-share programs, and payment programs
    - _Requirements: 10.1, 10.2_

- [x] 3. Implement Authentication Service
  - [x] 3.1 Create password hashing and comparison functions using bcrypt
    - Implement hashPassword function with 10 salt rounds
    - Implement comparePassword function for secure password verification
    - _Requirements: 14.1, 14.2, 14.3_
  
  - [x] 3.2 Create JWT token generation and validation functions
    - Implement generateJWT function signing with secret key
    - Implement verifyJWT middleware for protected routes
    - _Requirements: 14.4_
  
  - [x] 3.3 Implement user registration logic
    - Validate required fields (email, password, farm profile attributes)
    - Check for duplicate email addresses
    - Hash password before storing
    - Create user record with timestamp
    - _Requirements: 2.1, 2.8, 13.1, 13.7_
  
  - [ ]* 3.4 Write property test for registration
    - **Property 1: Registration creates hashed accounts**
    - **Validates: Requirements 1.1, 2.8, 14.1, 14.2**
  
  - [x] 3.5 Implement user login logic
    - Find user by email
    - Compare password using bcrypt
    - Generate JWT token on successful authentication
    - Return sanitized user profile (exclude password field)
    - _Requirements: 1.3, 14.5_
  
  - [ ]* 3.6 Write property test for login security
    - **Property 3: Valid login generates JWT and returns sanitized profile**
    - **Validates: Requirements 1.3, 1.5, 9.1, 9.2, 14.5**
  
  - [ ]* 3.7 Write property test for password security
    - **Property 6: Password security round-trip**
    - **Validates: Requirements 14.1, 14.3**
  
  - [ ]* 3.8 Write unit tests for authentication edge cases
    - Test duplicate email registration returns error
    - Test invalid credentials return appropriate errors
    - Test password field exclusion from responses
    - _Requirements: 1.2, 1.4, 14.5_

- [x] 4. Implement AWS Bedrock Service
  - [x] 4.1 Set up AWS Bedrock client configuration
    - Import BedrockRuntimeClient and InvokeModelCommand from @aws-sdk/client-bedrock-runtime
    - Initialize Bedrock client with AWS credentials from environment variables
    - Configure region (default: us-east-1)
    - Set model ID (default: anthropic.claude-3-haiku-20240307-v1:0)
    - Set timeout configuration (default: 30000ms)
    - _Requirements: 3.1, 3.2_
  
  - [x] 4.2 Implement Bedrock prompt builder
    - Create buildPrompt function that formats user profile and programs list
    - Include farmer profile attributes (acres, experience, state, farmerType, purposes)
    - Include program details for each program (id, name, agency, eligibility, etc.)
    - Format prompt to request JSON array with programId, score (0-100), and reasons array
    - Include scoring instructions: experience match, farm size, state, farmer type, purposes, bonuses
    - _Requirements: 3.2, 3.4_
  
  - [ ]* 4.3 Write property test for prompt structure
    - **Property 17: Bedrock API call structure**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**
  
  - [x] 4.4 Implement Bedrock API call function
    - Create callBedrock function that sends prompt to Bedrock
    - Construct InvokeModelCommand with model ID, prompt, and parameters
    - Set anthropic_version: "bedrock-2023-05-31"
    - Set max_tokens: 4096
    - Send command using bedrockClient.send()
    - Return raw response
    - _Requirements: 3.2, 3.3_
  
  - [x] 4.5 Implement Bedrock response parser
    - Create parseBedrockResponse function to extract JSON from response
    - Decode response body using TextDecoder
    - Extract content[0].text from Bedrock response structure
    - Parse JSON array from text (handle markdown code blocks if present)
    - Validate response structure (array with programId, score, reasons)
    - Throw error if response format is invalid
    - _Requirements: 3.4_
  
  - [ ]* 4.6 Write property test for response parsing
    - **Property 18: Bedrock response parsing and validation**
    - **Validates: Requirements 3.4, 4.8**
  
  - [x] 4.7 Implement timeout and error handling for Bedrock calls
    - Wrap Bedrock API call with Promise.race for timeout enforcement
    - Create timeout promise that rejects after configured timeout (30s)
    - Catch and handle specific AWS errors (CredentialsError, ThrottlingException)
    - Catch and handle network errors
    - Catch and handle parsing errors
    - Log all Bedrock errors with details
    - _Requirements: 3.3, 3.6_
  
  - [ ]* 4.8 Write property test for timeout and fallback
    - **Property 19: Bedrock timeout and fallback**
    - **Validates: Requirements 3.3, 3.6, 4.7, 4.8**
  
  - [x] 4.9 Implement Bedrock call logging
    - Create logBedrockCall function to track Bedrock usage
    - Log timestamp, success/failure, error details, profile summary
    - Log to console for MVP (can be extended to file/service later)
    - _Requirements: 4.7, 4.8_
  
  - [ ]* 4.10 Write property test for Bedrock logging
    - **Property 28: Bedrock call logging**
    - **Validates: Requirements 3.3, 4.7, 4.8**

- [x] 5. Implement rule-based matching engine (fallback)
  - [x] 5.1 Create multi-criteria scoring algorithm
    - Implement experience level matching with range analysis (up to 30 points)
    - Implement farm size matching with threshold detection (up to 20 points)
    - Implement state location matching (up to 15 points)
    - Implement farmer type matching (up to 20 points, 10 per type)
    - Implement funding purposes matching (up to 25 points, 12 per purpose)
    - _Requirements: 4.9, 4.10, 4.11, 4.12, 4.13_
  
  - [x] 5.2 Implement bonus scoring system
    - Add 10 points for grant/payment programs (no repayment required)
    - Add 5 points for urgent deadlines (within 60 days from current date)
    - Add 5 points for fast approval programs (application time < 30 days)
    - _Requirements: 4.14_
  
  - [x] 5.3 Implement match percentage calculation and capping
    - Calculate percentage as (score / 100) * 100
    - Cap match percentage at 100% maximum
    - _Requirements: 4.4_
  
  - [ ]* 5.4 Write property test for multi-criteria scoring
    - **Property 9: Multi-criteria weighted scoring (fallback mode)**
    - **Validates: Requirements 4.9, 4.10, 4.11, 4.12, 4.13, 4.14, 4.15, 4.16, 4.17**
  
  - [ ]* 5.5 Write property test for match percentage
    - **Property 10: Match percentage calculation and capping**
    - **Validates: Requirements 4.4**
  
  - [ ]* 5.6 Write unit tests for scoring edge cases
    - Test zero matches (no criteria met)
    - Test perfect matches (all criteria met)
    - Test bonus scoring combinations
    - Test percentage capping at 100%
    - _Requirements: 4.4_

- [x] 6. Implement rule-based match explanation generator (fallback)
  - [x] 6.1 Create explanation generation for each scoring criterion
    - Generate experience match reasons with confidence levels
    - Generate farm size match reasons with comparative analysis
    - Generate state location reasons with geographic relevance
    - Generate farmer type match reasons with priority weighting
    - Generate funding purpose reasons with relevance scores
    - Generate grant/payment advantage reasons
    - Generate deadline urgency reasons with dates
    - Generate fast approval reasons with timelines
    - _Requirements: 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11, 5.12_
  
  - [x] 6.2 Implement reason prioritization and formatting
    - Sort reasons by importance and relevance
    - Format as array of strings for UI display
    - _Requirements: 5.3_
  
  - [ ]* 6.3 Write property test for explanation generation
    - **Property 15: Rule-based explanation generation for matching criteria (fallback mode)**
    - **Validates: Requirements 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11, 5.12**
  
  - [ ]* 6.4 Write unit tests for explanation formatting
    - Test reason generation for each criterion type
    - Test prioritization logic
    - _Requirements: 5.3_

- [x] 7. Implement unified matching engine with Bedrock and fallback
  - [x] 7.1 Create main matching function with Bedrock-first approach
    - Implement calculateMatches function that tries Bedrock first
    - Wrap Bedrock call in try-catch block
    - On Bedrock success, use AI-generated scores and reasons
    - On Bedrock failure/timeout, fall back to rule-based scoring
    - Log which method was used (Bedrock or fallback)
    - _Requirements: 3.1, 3.3, 3.6, 4.7, 4.8_
  
  - [ ]* 7.2 Write property test for fallback behavior
    - **Property 29: Fallback to rule-based matching**
    - **Validates: Requirements 4.7, 4.8**
  
  - [x] 7.3 Implement filtering and ranking logic
    - Filter out programs with match scores below threshold (currently 30 points)
    - Sort programs by match score descending
    - Apply secondary sorting by deadline urgency
    - Apply tertiary sorting by funding amount
    - _Requirements: 4.5, 4.6_
  
  - [x] 7.4 Implement Best Pick identification
    - Identify highest-scoring program as Best Pick
    - Mark Best Pick with isBestPick flag
    - Position Best Pick as first in results
    - _Requirements: 6.1, 6.2, 6.5_
  
  - [ ]* 7.5 Write property test for threshold filtering
    - **Property 11: Threshold filtering of low matches**
    - **Validates: Requirements 4.5**
  
  - [ ]* 7.6 Write property test for ranking
    - **Property 12: Score-based ranking**
    - **Validates: Requirements 4.6**
  
  - [ ]* 7.7 Write property test for Best Pick identification
    - **Property 13: Best pick identification**
    - **Validates: Requirements 6.1, 6.2, 6.5**
  
  - [ ]* 7.8 Write unit tests for ranking edge cases
    - Test empty results handling
    - Test single program results
    - Test tie-breaking logic
    - _Requirements: 4.6, 6.1_

- [x] 8. Implement backend API endpoints
  - [x] 8.1 Create POST /api/register endpoint
    - Accept email, password, acres, experience, state, farmerType, purposes in request body
    - Validate all required fields are present
    - Call Authentication Service register function
    - Return success message or error with appropriate HTTP status codes
    - _Requirements: 12.1, 12.5, 11.2_
  
  - [x] 8.2 Create POST /api/login endpoint
    - Accept email and password in request body
    - Call Authentication Service login function
    - Return JWT token and sanitized user profile or error
    - Set appropriate HTTP status codes
    - _Requirements: 12.2, 12.6, 11.3_
  
  - [x] 8.3 Create POST /api/match endpoint
    - Accept acres, experience, state, farmerType, purposes in request body
    - Call unified Matching Engine (Bedrock-first with fallback)
    - Apply filtering and ranking
    - Return array of matched programs with scores, percentages, and reasons
    - _Requirements: 12.3, 12.7_
  
  - [x] 8.4 Create GET /api/programs endpoint
    - Return all programs from Profile Store
    - Format as JSON array
    - _Requirements: 12.4, 12.8_
  
  - [ ]* 8.5 Write property test for API response formats
    - **Property 21: Registration API response format**
    - **Property 22: Login API response format**
    - **Property 23: Match API response format**
    - **Validates: Requirements 12.1, 12.2, 12.3, 12.5, 12.6, 12.7, 11.2, 11.3**
  
  - [ ]* 8.6 Write property test for HTTP status codes
    - **Property 24: HTTP status code correctness**
    - **Validates: Requirements 12.9**

- [x] 9. Implement error handling and validation
  - [x] 9.1 Create input validation functions
    - Validate email format using regex
    - Validate password minimum length (6 characters)
    - Validate numeric fields (acres > 0, experience >= 0)
    - Validate enum fields (state in [SC, NC, GA])
    - Validate array fields (farmerType and purposes non-empty)
    - _Requirements: 13.7_
  
  - [x] 9.2 Implement global error handler middleware
    - Catch all unhandled errors
    - Log errors for debugging
    - Return appropriate error messages and status codes
    - Hide sensitive error details in production
    - _Requirements: 11.2, 11.3, 11.5_
  
  - [x] 9.3 Implement Bedrock error handling with fallback
    - Wrap Bedrock calls in try-catch
    - Fall back to rule-based matching if Bedrock fails
    - Log Bedrock failures for monitoring
    - Ensure no user-visible errors from Bedrock failures
    - _Requirements: 3.3, 3.6, 4.7, 4.8_
  
  - [ ]* 9.4 Write property test for input validation
    - **Property 7: Input validation before processing**
    - **Validates: Requirements 13.7**
  
  - [ ]* 9.5 Write unit tests for error handling
    - Test validation error messages
    - Test network error handling
    - Test Bedrock fallback behavior
    - Test AWS credentials errors
    - Test Bedrock timeout errors
    - _Requirements: 11.2, 11.3, 11.5, 3.3, 4.7_

- [ ] 10. Checkpoint - Ensure backend tests pass
  - Run all backend unit tests and property tests
  - Verify API endpoints respond correctly
  - Test Bedrock integration and fallback scenarios
  - Test error handling scenarios
  - Ensure all tests pass, ask the user if questions arise

- [x] 11. Implement frontend authentication UI
  - [x] 11.1 Create registration form HTML and styling
    - Build form with fields: email, password, acres, experience, state dropdown
    - Add checkboxes for farmer types (young, beginning, small)
    - Add checkboxes for funding purposes (equipment, operating_costs, land_purchase, irrigation)
    - Style form with responsive CSS
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 9.5_
  
  - [x] 11.2 Create login form HTML and styling
    - Build form with email and password fields
    - Add submit button and link to registration
    - Style form consistently with registration
    - _Requirements: 2.1_
  
  - [x] 11.3 Implement registration form submission handler
    - Collect form data and validate client-side
    - Send POST request to /api/register
    - Handle success response with success message
    - Handle error response with error message display
    - _Requirements: 2.1, 11.1, 11.2_
  
  - [x] 11.4 Implement login form submission handler
    - Collect credentials and send POST request to /api/login
    - Store JWT token in localStorage on success
    - Store user profile in localStorage on success
    - Display success message and redirect to matching interface
    - Handle errors with appropriate error messages
    - _Requirements: 2.1, 2.2, 8.1, 8.2, 11.3_
  
  - [ ]* 11.5 Write unit tests for form validation
    - Test client-side validation rules
    - Test form submission with valid data
    - Test form submission with invalid data
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 13.7_

- [x] 12. Implement session management
  - [x] 12.1 Create session storage functions
    - Implement saveSession(token, user) storing to localStorage
    - Implement loadSession() retrieving from localStorage
    - Implement clearSession() removing from localStorage
    - Implement isAuthenticated() checking for valid session
    - _Requirements: 2.2, 2.3, 8.1, 8.2, 8.3_
  
  - [x] 12.2 Implement automatic session restoration on page load
    - Check localStorage for authentication data on app initialization
    - Restore user session if valid data exists
    - Automatically fetch and display matching programs
    - Skip login if session is valid
    - _Requirements: 2.3, 8.4, 8.5_
  
  - [x] 12.3 Implement logout functionality
    - Create logout button in UI
    - Clear localStorage on logout click
    - Redirect to login screen
    - _Requirements: 2.4, 8.6_
  
  - [ ]* 12.4 Write property test for session restoration
    - **Property 4: Session restoration from localStorage**
    - **Validates: Requirements 2.3, 8.3, 8.4, 8.5**
  
  - [ ]* 12.5 Write property test for logout
    - **Property 5: Logout clears all session data**
    - **Validates: Requirements 2.4, 8.6**

- [x] 13. Implement matching results display UI
  - [x] 13.1 Create program card component structure
    - Design card layout with header, body, and footer sections
    - Add Best Pick badge element (🏆 BEST MATCH)
    - Add match percentage display
    - Style cards with responsive CSS and hover effects
    - _Requirements: 6.3, 6.4, 6.6, 7.10_
  
  - [x] 13.2 Implement program information display
    - Display program name prominently in card header
    - Display agency, type, and max amount in card body
    - Display interest rate for loan programs
    - Display deadline and application time
    - Display benefits as bulleted list
    - Display match reasons (AI-generated from Bedrock or rule-based) as prioritized list
    - Add clickable link to official program website
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9_
  
  - [x] 13.3 Implement Best Pick visual distinction
    - Apply special styling to Best Pick card (border, background color)
    - Position Best Pick as first card in results
    - Display Best Pick badge prominently
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_
  
  - [x] 13.4 Implement empty results handling
    - Display message when no programs match threshold
    - Suggest profile updates to improve matches
    - _Requirements: 11.4_
  
  - [ ]* 13.5 Write property test for complete program display
    - **Property 27: Complete program information display**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10**
  
  - [ ]* 13.6 Write property test for AI-generated explanations
    - **Property 14: AI-generated explanations from Bedrock**
    - **Validates: Requirements 5.1, 5.2, 5.3**
  
  - [ ]* 13.7 Write property test for complete match reasons display
    - **Property 16: Complete match reasons display**
    - **Validates: Requirements 5.3**

- [x] 14. Implement matching flow integration
  - [x] 14.1 Create match request function
    - Retrieve user profile from localStorage
    - Send POST request to /api/match with profile data
    - Handle response and parse matched programs
    - Handle errors with error message display
    - _Requirements: 4.1, 12.3_
  
  - [x] 14.2 Implement results rendering
    - Clear previous results from DOM
    - Iterate through matched programs array
    - Create and append program cards to results container
    - Apply Best Pick styling to first program
    - _Requirements: 4.6, 6.5_
  
  - [ ]* 14.3 Write integration tests for matching flow
    - Test end-to-end flow: login → match request → results display
    - Test Best Pick identification and display
    - Test Bedrock vs fallback result display
    - _Requirements: 4.1, 6.1_

- [x] 15. Implement user feedback messaging system
  - [x] 15.1 Create alert message component
    - Build alert container with success and error variants
    - Style alerts with appropriate colors and icons
    - Position alerts prominently at top of sections
    - _Requirements: 11.7_
  
  - [x] 15.2 Implement auto-dismiss functionality
    - Show alert when triggered
    - Set 5-second timeout for auto-dismiss
    - Provide manual close button
    - _Requirements: 11.6_
  
  - [x] 15.3 Integrate alerts with all user actions
    - Show success alert on successful registration
    - Show success alert on successful login
    - Show error alerts for all failure scenarios
    - Show network error alerts with details
    - _Requirements: 11.1, 11.2, 11.3, 11.5_
  
  - [ ]* 15.4 Write property test for feedback messages
    - **Property 25: Success message display**
    - **Property 26: Error message display**
    - **Validates: Requirements 11.1, 11.2, 11.3, 11.5, 11.6**

- [x] 16. Implement responsive design
  - [x] 16.1 Create mobile-first CSS layout
    - Use flexbox/grid for responsive layouts
    - Set base styles for mobile (320px+)
    - Ensure touch-friendly button sizes (min 44px)
    - _Requirements: 9.1, 9.5_
  
  - [x] 16.2 Add tablet breakpoint styles (768px+)
    - Adjust layout for tablet screen sizes
    - Optimize card grid for medium screens
    - _Requirements: 9.2_
  
  - [x] 16.3 Add desktop breakpoint styles (1024px+)
    - Optimize layout for large screens
    - Adjust card grid for desktop viewing
    - Ensure readability across all sizes
    - _Requirements: 9.3, 9.6_
  
  - [ ]* 16.4 Write responsive design tests
    - Test layout at mobile breakpoint
    - Test layout at tablet breakpoint
    - Test layout at desktop breakpoint
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 17. Implement privacy-preserving features
  - [x] 17.1 Create data handling functions
    - Exclude password field from all API responses
    - Validate and sanitize all user inputs
    - Ensure only necessary profile data sent to Bedrock (no email, no password)
    - _Requirements: 13.5, 13.6, 13.7_
  
  - [ ]* 17.2 Write property test for privacy preservation
    - **Property 30: Privacy-preserving data handling**
    - **Validates: Requirements 13.7**
  
  - [ ]* 17.3 Write unit tests for security features
    - Test password exclusion from responses
    - Test input sanitization
    - Test Bedrock data minimization
    - _Requirements: 13.5, 13.7_

- [ ] 18. Checkpoint - Ensure all tests pass
  - Run complete test suite (unit tests and property tests)
  - Verify all 30 correctness properties pass
  - Test end-to-end user flows manually
  - Test Bedrock integration and fallback scenarios
  - Ensure all tests pass, ask the user if questions arise

- [x] 19. Integration and final wiring
  - [x] 19.1 Connect all frontend components to backend APIs
    - Verify registration flow works end-to-end
    - Verify login and session restoration works
    - Verify matching flow displays results correctly (Bedrock and fallback)
    - _Requirements: 2.1, 2.2, 2.3, 4.1_
  
  - [x] 19.2 Implement production configuration
    - Set up environment variables for production
    - Configure HTTPS settings
    - Set up CORS for production domains
    - Document AWS Bedrock setup requirements
    - Document deployment requirements
    - _Requirements: 13.6_
  
  - [x] 19.3 Add comprehensive error handling throughout
    - Ensure all API calls have error handlers
    - Ensure all user actions provide feedback
    - Test error scenarios and recovery
    - Test Bedrock timeout and fallback
    - _Requirements: 11.2, 11.3, 11.5, 3.3, 4.7_
  
  - [ ]* 19.4 Write end-to-end integration tests
    - Test complete user journey: register → login → match → view results
    - Test session persistence across page reloads
    - Test error recovery scenarios
    - Test Bedrock success and fallback paths
    - _Requirements: 2.1, 2.2, 2.3, 4.1, 8.3, 8.4_

- [ ] 20. Final checkpoint - Complete system validation
  - Run all tests (unit, property, integration, e2e)
  - Verify all 30 correctness properties pass with 100+ iterations
  - Test on multiple devices and browsers
  - Verify responsive design works correctly
  - Test Bedrock integration with real AWS credentials
  - Test fallback behavior when Bedrock is unavailable
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with 100+ randomized iterations
- Unit tests validate specific examples, edge cases, and error conditions
- The implementation uses JavaScript/Node.js with Express.js framework
- AWS Bedrock integration uses Claude 3 Haiku model for AI-powered matching
- AWS SDK for JavaScript v3 (@aws-sdk/client-bedrock-runtime) is used for Bedrock API calls
- Rule-based fallback ensures continuous service when Bedrock is unavailable
- Testing uses Jest for unit tests and fast-check for property-based tests
- All property tests must include the tag: `// Feature: farm-funding-matcher-documentation, Property {number}: {property_text}`
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- Privacy and security are built into the design from the start
- This is an MVP - no complex ML pipelines, NLP processors, or adaptive learning systems
