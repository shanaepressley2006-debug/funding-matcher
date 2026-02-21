# Smart Farm Funding Matcher

An AI-powered web application that matches Young, Beginning, and Small (YBS) row crop farmers with relevant USDA and state funding programs using AWS Bedrock (Claude 3 Haiku) with intelligent rule-based fallback.

## Features

- **AI-Powered Matching**: Uses AWS Bedrock (Claude 3 Haiku) for intelligent program matching with natural language explanations
- **Automatic Fallback**: Seamlessly falls back to rule-based scoring when Bedrock is unavailable
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Session Persistence**: Automatic session restoration across browser sessions
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Matching**: Instant program recommendations based on farmer profile
- **Best Pick Identification**: Highlights the top matching program with detailed reasoning

## Technology Stack

- **Backend**: Node.js, Express.js
- **AI Service**: AWS Bedrock (Claude 3 Haiku)
- **Authentication**: JWT, bcrypt
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Storage**: In-memory (MVP)

## Prerequisites

- Node.js 14+ and npm
- AWS Account with Bedrock access (optional - system works without it)
- AWS IAM credentials with `bedrock:InvokeModel` permission

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd farm-funding-matcher
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# AWS Bedrock Configuration (optional - leave empty to use fallback mode)
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1

# Bedrock Model Configuration
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
BEDROCK_TIMEOUT=30000
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The application will be available at `http://localhost:3000`

## AWS Bedrock Setup

### Option 1: With AWS Bedrock (AI-Powered Matching)

1. **Create AWS Account**: Sign up at https://aws.amazon.com

2. **Enable Bedrock Access**:
   - Go to AWS Bedrock console
   - Request access to Claude 3 Haiku model
   - Wait for approval (usually instant)

3. **Create IAM User**:
   - Go to IAM console
   - Create new user with programmatic access
   - Attach policy with `bedrock:InvokeModel` permission:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": ["bedrock:InvokeModel"],
         "Resource": ["arn:aws:bedrock:*::foundation-model/anthropic.claude-3-haiku-20240307-v1:0"]
       }
     ]
   }
   ```

4. **Configure Credentials**:
   - Copy Access Key ID and Secret Access Key
   - Add to `.env` file

### Option 2: Without AWS Bedrock (Rule-Based Fallback)

Simply leave AWS credentials empty in `.env`:
```env
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

The system will automatically use the rule-based scoring algorithm.

## Usage

1. **Register**: Create an account with your farm profile
   - Email and password
   - Farm size (acres)
   - Years of experience
   - State (SC, NC, or GA)
   - Farmer status (young, beginning, small)
   - Funding needs

2. **Login**: Access your account with email and password

3. **View Matches**: Automatically see ranked funding programs
   - Best Pick highlighted with 🏆 badge
   - Match percentage for each program
   - Detailed match reasons (AI-generated or rule-based)
   - Program benefits and application details
   - Direct links to official program websites

4. **Session Persistence**: Your session is saved - no need to login again

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Matching
- `POST /api/match` - Get program matches for profile
- `GET /api/programs` - Get all available programs

## Project Structure

```
farm-funding-matcher/
├── models/
│   ├── profileStore.js      # In-memory data storage
│   └── programData.js        # Funding program database
├── services/
│   ├── authService.js        # Authentication logic
│   ├── bedrockService.js     # AWS Bedrock integration
│   ├── ruleBasedScorer.js    # Fallback scoring algorithm
│   └── matchingService.js    # Unified matching engine
├── utils/
│   └── validation.js         # Input validation
├── public/
│   ├── index.html            # Frontend HTML
│   ├── app.js                # Frontend JavaScript
│   └── styles.css            # Frontend CSS
├── server.js                 # Express server
├── .env                      # Environment variables
└── package.json              # Dependencies
```

## Matching Algorithm

### AI-Powered (Bedrock)
- Uses Claude 3 Haiku to analyze farmer profile and programs
- Generates intelligent match scores (0-100)
- Provides natural language explanations
- 30-second timeout with automatic fallback

### Rule-Based (Fallback)
Weighted scoring across 8 criteria:
- Experience Match: 30 points
- Farm Size Match: 20 points
- State Location: 15 points
- Farmer Type: 20 points
- Funding Purposes: 25 points
- Grant Bonus: 10 points
- Deadline Urgency: 5 points
- Fast Approval: 5 points

Programs with scores ≥30 are shown, ranked by score.

## Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens for session management
- Password field excluded from all API responses
- Input validation on all endpoints
- HTTPS recommended for production

## Deployment

### Render / Heroku / Railway

1. Create new web service
2. Connect GitHub repository
3. Set environment variables in dashboard
4. Deploy

### AWS / DigitalOcean / VPS

1. Install Node.js on server
2. Clone repository
3. Install dependencies: `npm install`
4. Set environment variables
5. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name farm-funding-matcher
pm2 save
pm2 startup
```

## Cost Considerations

### With AWS Bedrock
- Claude 3 Haiku: ~$0.001-0.002 per match request
- Very affordable for MVP and small-scale usage
- Monitor usage via AWS CloudWatch

### Without AWS Bedrock
- Free - uses rule-based algorithm
- No external API costs

## Troubleshooting

### Bedrock Not Working
- Check AWS credentials in `.env`
- Verify Bedrock model access in AWS console
- Check IAM permissions
- System will automatically fall back to rule-based scoring

### Port Already in Use
- Change PORT in `.env` file
- Or kill process using port: `lsof -ti:3000 | xargs kill`

### Dependencies Not Installing
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## Contributing

This is an MVP implementation. Future enhancements could include:
- Database persistence (PostgreSQL, MongoDB)
- User profile editing
- Program favorites/bookmarks
- Email notifications for deadlines
- Admin panel for program management
- Advanced filtering and search
- Multi-language support

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
