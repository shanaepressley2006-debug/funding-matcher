# Requirements Document

## Introduction

The Smart Farm Funding Matcher is a web-based funding discovery tool designed specifically for Young, Beginning, and Small (YBS) row crop farmers. The system addresses the challenge faced by farmers who need to quickly identify relevant USDA funding programs without wasting time on lengthy applications or repeatedly entering the same information. The application provides intelligent matching using AWS Bedrock (Amazon's managed AI service) to analyze farmer profiles and recommend matching programs with explanations. A rule-based scoring algorithm serves as a fallback when Bedrock is unavailable, ensuring the system remains functional in all scenarios.

## Glossary

- **System**: The Smart Farm Funding Matcher web application
- **User**: A farmer seeking funding opportunities (Young, Beginning, or Small farmer)
- **Profile**: User's farm information including acreage, experience, location, farmer status, and funding needs
- **Program**: A USDA or state funding opportunity (loan, grant, or payment program)
- **Match_Score**: A numerical value (0-100) indicating how well a program fits a user's profile
- **Best_Pick**: The highest-scoring program recommendation for a specific user
- **Authentication_Service**: The JWT-based login and registration system
- **Matching_Engine**: The AI-powered matching system that uses AWS Bedrock to analyze profiles and programs, with rule-based scoring as fallback
- **Bedrock_Service**: AWS Bedrock managed AI service that analyzes farmer profiles and program lists to return scored matches with explanations
- **Rule_Based_Scorer**: The fallback scoring system that calculates match scores using weighted criteria when Bedrock is unavailable
- **Profile_Store**: In-memory storage for user profiles and authentication data
- **YBS_Farmer**: Young (under 35), Beginning (≤10 years experience), or Small farmer designation

## Requirements

### Requirement 1: User Registration and Authentication

**User Story:** As a farmer, I want to create an account and securely log in, so that my farm profile is saved and I can access my matches anytime.

#### Acceptance Criteria

1. WHEN a User submits registration with email, password, and farm details, THE Authentication_Service SHALL create a new account with hashed password
2. IF a User attempts to register with an existing email, THEN THE Authentication_Service SHALL return an error message "User already exists"
3. WHEN a User submits valid login credentials, THE Authentication_Service SHALL generate a JWT token and return the user profile
4. IF a User submits invalid credentials, THEN THE Authentication_Service SHALL return an appropriate error message
5. WHEN a User successfully logs in, THE System SHALL store the authentication token and profile in browser local storage
6. WHEN a User returns to the application, THE System SHALL automatically restore the session from local storage
7. WHEN a User clicks logout, THE System SHALL clear the authentication token and profile from local storage

### Requirement 2: Farm Profile Collection

**User Story:** As a farmer, I want to provide my farm information once, so that the system can match me with relevant funding programs.

#### Acceptance Criteria

1. WHEN a User registers, THE System SHALL collect farm size in acres (numeric value)
2. WHEN a User registers, THE System SHALL collect years of farming experience (numeric value)
3. WHEN a User registers, THE System SHALL collect state location from available options (SC, NC, GA)
4. WHEN a User registers, THE System SHALL collect farmer status types (young, beginning, small) via checkboxes
5. WHEN a User registers, THE System SHALL collect funding needs (equipment, operating_costs, land_purchase, irrigation) via checkboxes
6. THE System SHALL allow multiple farmer status selections simultaneously
7. THE System SHALL allow multiple funding need selections simultaneously
8. WHEN profile data is saved, THE Profile_Store SHALL persist all collected attributes for matching

### Requirement 3: AWS Bedrock Configuration

**User Story:** As a system administrator, I want to configure AWS Bedrock credentials, so that the system can access AI-powered matching capabilities.

#### Acceptance Criteria

1. THE System SHALL accept AWS credentials via environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION)
2. THE System SHALL validate AWS credentials on startup
3. IF AWS credentials are missing or invalid, THEN THE System SHALL log a warning and enable fallback mode
4. THE System SHALL use AWS SDK for JavaScript to communicate with Bedrock
5. THE System SHALL configure the Bedrock model identifier via environment variable (default: anthropic.claude-3-haiku-20240307-v1:0)
6. THE System SHALL set reasonable timeout values for Bedrock API calls (default: 30 seconds)

### Requirement 4: AI-Powered Matching with Bedrock

**User Story:** As a farmer, I want the system to use AI to intelligently identify programs that fit my situation, so that I receive accurate and nuanced recommendations based on my profile.

#### Acceptance Criteria

1. WHEN a User profile is submitted, THE Matching_Engine SHALL attempt to use Bedrock_Service for match scoring
2. WHEN calling Bedrock, THE Matching_Engine SHALL send the farmer profile (acres, experience, state, farmerType, purposes) and the complete program list
3. WHEN calling Bedrock, THE Matching_Engine SHALL request scored matches with explanations in JSON format
4. THE Bedrock_Service SHALL return match scores (0-100) for each program with reasoning
5. THE Matching_Engine SHALL filter out programs with match scores below 30 points
6. THE Matching_Engine SHALL rank programs by match score in descending order
7. IF Bedrock_Service fails or times out, THEN THE Matching_Engine SHALL fall back to Rule_Based_Scorer
8. IF Bedrock_Service returns invalid data, THEN THE Matching_Engine SHALL fall back to Rule_Based_Scorer
9. WHEN using Rule_Based_Scorer fallback, THE Matching_Engine SHALL calculate scores using the 8-criteria weighted algorithm
10. THE Rule_Based_Scorer SHALL award up to 30 points for experience level matching
11. THE Rule_Based_Scorer SHALL award up to 20 points for farm size matching
12. THE Rule_Based_Scorer SHALL award up to 15 points for state location matching
13. THE Rule_Based_Scorer SHALL award up to 20 points for farmer type matching
14. THE Rule_Based_Scorer SHALL award up to 25 points for funding purposes matching
15. THE Rule_Based_Scorer SHALL award 10 bonus points for grant or direct payment programs
16. THE Rule_Based_Scorer SHALL award 5 bonus points for programs with deadlines within 60 days
17. THE Rule_Based_Scorer SHALL award 5 bonus points for programs with fast approval (2-3 weeks)

### Requirement 5: AI-Generated Match Explanations

**User Story:** As a farmer, I want to understand why each program matches my profile, so that I can make informed decisions about which programs to pursue.

#### Acceptance Criteria

1. WHEN Bedrock_Service scores a program, THE System SHALL use AI-generated explanations from Bedrock
2. THE Bedrock_Service SHALL provide natural language explanations for why each program matches the farmer profile
3. THE System SHALL display AI-generated explanations as a bulleted list for each program
4. WHEN using Rule_Based_Scorer fallback, THE System SHALL generate rule-based explanations for each matching criterion
5. WHEN experience qualifies for a program (fallback mode), THE System SHALL generate a reason explaining the experience match
6. WHEN farm size qualifies for a program (fallback mode), THE System SHALL generate a reason explaining the size match
7. WHEN state location qualifies for a program (fallback mode), THE System SHALL generate a reason indicating state availability
8. WHEN farmer types match program priorities (fallback mode), THE System SHALL generate a reason listing matching types
9. WHEN funding purposes match program offerings (fallback mode), THE System SHALL generate a reason listing matching purposes
10. WHEN a program is a grant or direct payment (fallback mode), THE System SHALL generate a reason highlighting no repayment requirement
11. WHEN a program deadline is within 60 days (fallback mode), THE System SHALL generate a reason with urgency indicator and deadline date
12. WHEN a program has fast approval (fallback mode), THE System SHALL generate a reason with approval timeframe

### Requirement 6: AI-Recommended Best Pick

**User Story:** As a farmer with limited time, I want to see my single best funding option recommended by AI, so that I can quickly identify the most relevant program.

#### Acceptance Criteria

1. WHEN Bedrock_Service returns matches, THE System SHALL identify the highest-scoring program as the Best_Pick
2. WHEN using Rule_Based_Scorer fallback, THE System SHALL identify the highest-scoring program as the Best_Pick
3. THE System SHALL visually distinguish the Best_Pick with a special badge showing "🏆 BEST MATCH"
4. THE System SHALL display the Best_Pick match percentage prominently
5. THE System SHALL position the Best_Pick as the first program in the results list
6. THE System SHALL apply distinct styling to the Best_Pick card to differentiate it from other matches

### Requirement 7: Program Information Display

**User Story:** As a farmer, I want to see comprehensive details about each matching program, so that I can evaluate my options and understand what's available.

#### Acceptance Criteria

1. FOR ALL matching programs, THE System SHALL display the program name
2. FOR ALL matching programs, THE System SHALL display the administering agency
3. FOR ALL matching programs, THE System SHALL display the program type (Loan, Grant, Cost-share Grant, Direct Payment, Annual Payment)
4. FOR ALL matching programs, THE System SHALL display the maximum funding amount
5. WHEN a program is a loan, THE System SHALL display the interest rate
6. FOR ALL matching programs, THE System SHALL display the application deadline
7. FOR ALL matching programs, THE System SHALL display the estimated application time
8. FOR ALL matching programs, THE System SHALL display a list of key benefits
9. FOR ALL matching programs, THE System SHALL display match reasons as a bulleted list
10. FOR ALL matching programs, THE System SHALL provide a clickable link to the official program website

### Requirement 8: Session Persistence

**User Story:** As a farmer, I want my login session to persist across browser sessions, so that I don't have to log in every time I visit the application.

#### Acceptance Criteria

1. WHEN a User successfully logs in, THE System SHALL store the JWT token in browser local storage
2. WHEN a User successfully logs in, THE System SHALL store the user profile in browser local storage
3. WHEN the application loads, THE System SHALL check for existing authentication data in local storage
4. IF valid authentication data exists in local storage, THEN THE System SHALL automatically restore the user session
5. IF valid authentication data exists in local storage, THEN THE System SHALL automatically display matching programs
6. WHEN a User logs out, THE System SHALL remove all authentication data from local storage

### Requirement 9: Responsive User Interface

**User Story:** As a farmer who may access the application from different devices, I want the interface to work well on mobile phones, tablets, and desktop computers, so that I can use it wherever I am.

#### Acceptance Criteria

1. THE System SHALL render properly on mobile devices with screen widths of 320px and above
2. THE System SHALL render properly on tablet devices with screen widths of 768px and above
3. THE System SHALL render properly on desktop devices with screen widths of 1024px and above
4. THE System SHALL use responsive CSS layouts that adapt to different screen sizes
5. THE System SHALL ensure all interactive elements are touch-friendly on mobile devices
6. THE System SHALL maintain readability of text content across all device sizes

### Requirement 10: Program Database Management

**User Story:** As a system administrator, I want the application to maintain an accurate database of funding programs, so that farmers receive current and relevant information.

#### Acceptance Criteria

1. THE Profile_Store SHALL maintain a collection of funding programs with all required attributes
2. FOR ALL programs, THE Profile_Store SHALL store name, agency, maximum amount, type, and interest rate
3. FOR ALL programs, THE Profile_Store SHALL store eligibility criteria including experience range, acreage limits, and state availability
4. FOR ALL programs, THE Profile_Store SHALL store farmer type priorities and supported funding purposes
5. FOR ALL programs, THE Profile_Store SHALL store deadline, application time, benefits list, and official URL
6. THE System SHALL provide an API endpoint to retrieve all programs
7. THE System SHALL include at least 8 diverse funding programs covering loans, grants, and payment programs

### Requirement 11: Error Handling and User Feedback

**User Story:** As a farmer, I want clear feedback when something goes wrong or when actions succeed, so that I understand what happened and what to do next.

#### Acceptance Criteria

1. WHEN registration succeeds, THE System SHALL display a success message prompting the user to login
2. WHEN registration fails, THE System SHALL display an error message explaining the failure reason
3. WHEN login fails, THE System SHALL display an error message explaining the failure reason
4. WHEN no matching programs are found, THE System SHALL display a message suggesting profile updates
5. WHEN a network error occurs, THE System SHALL display an error message with the error details
6. THE System SHALL automatically dismiss success and error messages after 5 seconds
7. THE System SHALL display alert messages prominently at the top of the relevant section

### Requirement 12: API Endpoint Specification

**User Story:** As a developer integrating with the system, I want well-defined API endpoints, so that I can reliably interact with the backend services.

#### Acceptance Criteria

1. THE System SHALL provide a POST /api/register endpoint accepting email, password, acres, experience, state, farmerType, and purposes
2. THE System SHALL provide a POST /api/login endpoint accepting email and password
3. THE System SHALL provide a POST /api/match endpoint accepting acres, experience, state, farmerType, and purposes
4. THE System SHALL provide a GET /api/programs endpoint returning all available programs
5. WHEN /api/register succeeds, THE Authentication_Service SHALL return a success message
6. WHEN /api/login succeeds, THE Authentication_Service SHALL return a JWT token and user profile (excluding password)
7. WHEN /api/match succeeds, THE Matching_Engine SHALL return an array of scored and ranked programs
8. THE System SHALL use JSON format for all API request and response bodies
9. THE System SHALL return appropriate HTTP status codes (200 for success, 400 for client errors, 500 for server errors)

### Requirement 13: Security and Data Protection

**User Story:** As a farmer, I want my account information to be secure, so that my personal data and farm details are protected.

#### Acceptance Criteria

1. WHEN a User registers, THE Authentication_Service SHALL hash the password using bcrypt with salt rounds of 10
2. THE Profile_Store SHALL never store passwords in plain text
3. WHEN a User logs in, THE Authentication_Service SHALL compare passwords using bcrypt secure comparison
4. THE Authentication_Service SHALL generate JWT tokens using a secret key
5. WHEN returning user data, THE System SHALL exclude the password field from the response
6. THE System SHALL use HTTPS in production environments for all data transmission
7. THE System SHALL validate all user inputs before processing

