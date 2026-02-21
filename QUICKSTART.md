# Quick Start Guide - Smart Farm Funding Matcher

Get up and running in 5 minutes!

## Option 1: Run Without AWS Bedrock (Fastest)

Perfect for testing and development. Uses rule-based matching algorithm.

### Steps:

1. **Install Dependencies**:
```bash
npm install
```

2. **Create .env File**:
```bash
cp .env.example .env
```

The default `.env` already has AWS credentials empty, so it will use fallback mode.

3. **Start Server**:
```bash
npm start
```

4. **Open Browser**:
```
http://localhost:3000
```

5. **Test the Application**:
   - Register a new account
   - Fill in your farm profile
   - See matching programs instantly!

**That's it!** The system will use rule-based scoring automatically.

## Option 2: Run With AWS Bedrock (AI-Powered)

Get AI-powered matching with natural language explanations.

### Prerequisites:
- AWS Account
- Bedrock access enabled
- IAM credentials with `bedrock:InvokeModel` permission

### Steps:

1. **Install Dependencies**:
```bash
npm install
```

2. **Configure AWS Credentials**:

Edit `.env` file:
```env
AWS_ACCESS_KEY_ID=your_actual_access_key_id
AWS_SECRET_ACCESS_KEY=your_actual_secret_access_key
AWS_REGION=us-east-1
```

3. **Start Server**:
```bash
npm start
```

4. **Verify Bedrock Connection**:

Look for this in the console:
```
✅ AWS Bedrock client initialized successfully
🤖 AWS Bedrock: Configured
```

5. **Test AI Matching**:
   - Register and login
   - View matches
   - Look for "🤖 AI-Powered Matching" badge at the top of results

## Testing the Application

### Test User Profile:
```
Email: farmer@example.com
Password: test123
Farm Size: 150 acres
Experience: 5 years
State: SC
Farmer Status: ✓ Beginning, ✓ Small
Funding Needs: ✓ Equipment, ✓ Operating Costs
```

### Expected Results:
- 5-8 matching programs
- Best Pick highlighted with 🏆
- Match percentages (60-100%)
- Detailed match reasons
- Program benefits and deadlines

## Troubleshooting

### "Port 3000 already in use"
Change port in `.env`:
```env
PORT=3001
```

### "AWS credentials not configured"
This is normal! The system will use rule-based fallback automatically.

### "Cannot find module"
Run:
```bash
npm install
```

### Bedrock Not Working
Check:
1. AWS credentials are correct in `.env`
2. Bedrock model access is enabled in AWS console
3. IAM permissions include `bedrock:InvokeModel`

The system will automatically fall back to rule-based scoring if Bedrock fails.

## Next Steps

### For Development:
- Modify programs in `models/programData.js`
- Adjust scoring weights in `services/ruleBasedScorer.js`
- Customize UI in `public/` folder

### For Production:
- Follow `DEPLOYMENT.md` guide
- Set strong JWT_SECRET
- Enable HTTPS
- Set up monitoring

### For Testing:
- Try different farmer profiles
- Compare Bedrock vs rule-based results
- Test session persistence (close browser, reopen)

## Quick Commands

```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Check if port is in use
lsof -ti:3000

# Kill process on port
lsof -ti:3000 | xargs kill
```

## File Structure Overview

```
farm-funding-matcher/
├── server.js              # Main server file
├── .env                   # Configuration (create from .env.example)
├── models/
│   ├── profileStore.js    # Data storage
│   └── programData.js     # Funding programs
├── services/
│   ├── authService.js     # Login/register
│   ├── bedrockService.js  # AWS Bedrock AI
│   ├── ruleBasedScorer.js # Fallback scoring
│   └── matchingService.js # Main matching logic
└── public/
    ├── index.html         # Frontend
    ├── app.js             # Frontend logic
    └── styles.css         # Styling
```

## Key Features to Test

1. **Registration**: Create account with farm profile
2. **Login**: Secure authentication with JWT
3. **Session Persistence**: Close browser, reopen - still logged in
4. **Matching**: See ranked programs instantly
5. **Best Pick**: Top program highlighted
6. **Match Reasons**: Detailed explanations for each match
7. **Responsive Design**: Try on mobile, tablet, desktop
8. **Logout**: Clear session and return to login

## Support

- Check `README.md` for detailed documentation
- See `DEPLOYMENT.md` for production deployment
- Open GitHub issue for bugs or questions

## Success Indicators

✅ Server starts without errors
✅ Can register new user
✅ Can login successfully
✅ See matching programs
✅ Best Pick is highlighted
✅ Match reasons are displayed
✅ Session persists after page reload
✅ Logout works correctly

If all checks pass, you're ready to go! 🎉

## What's Next?

1. **Customize Programs**: Edit `models/programData.js`
2. **Adjust Scoring**: Modify `services/ruleBasedScorer.js`
3. **Style Changes**: Update `public/styles.css`
4. **Add Features**: Extend functionality
5. **Deploy**: Follow `DEPLOYMENT.md` guide

Happy matching! 🌱
