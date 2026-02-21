# Farm Funding Swipe Matcher - User Guide

## Overview
The enhanced Tinder-style swipe interface provides an intuitive, mobile-friendly way to discover farm funding programs with AI-powered matching using AWS Bedrock.

## Access
Open your browser and navigate to:
```
http://localhost:3000/swipe.html
```

## Features

### 1. **Authentication System**
- **Login**: Existing users can log in with email/password
- **Register**: New users create an account with farm profile
- Session persistence using localStorage
- Secure JWT token authentication

### 2. **AI-Powered Matching**
- Primary: AWS Bedrock (Claude 3 Haiku) for intelligent matching
- Fallback: Rule-based scoring algorithm
- Visual indicator shows which method was used:
  - 🤖 **AI-Powered** badge (purple gradient)
  - 📊 **Rule-Based** badge (gray)

### 3. **Swipe Interface**
- **Swipe Right (♥)**: Save program to your list
- **Swipe Left (✗)**: Skip program
- **Info Button (i)**: Open program website in new tab
- Touch/mouse drag support
- Visual feedback with indicators
- Smooth animations

### 4. **Program Cards**
Each card displays:
- Match percentage (0-100%)
- Best Pick badge (🏆) for top match
- AI/Rule-based indicator
- Program name and agency
- Funding amount and type
- Interest rate (if applicable)
- Deadline and application time
- Personalized match reasons
- Key benefits
- Direct link to program website

### 5. **Saved Programs**
- View all saved programs
- Quick access to application links
- Match percentage and deadline info
- Return to swiping anytime

### 6. **Mobile Responsive**
- Optimized for phones and tablets
- Touch gesture support
- Adaptive layout and font sizes
- Smooth scrolling

## How to Use

### Step 1: Register or Login
1. Open `/swipe.html`
2. Choose "Register" tab for new account
3. Fill in your farm details:
   - Email and password
   - State (SC, NC, or GA)
   - Farm size in acres
   - Years of experience
   - Farmer status (young/beginning/small)
   - Funding needs (equipment/operating/land/irrigation)
4. Click "Register & Start Swiping"

### Step 2: Review Matches
1. See your match count at the top
2. Read the program card details
3. Swipe or use buttons:
   - **Right/♥**: Save for later
   - **Left/✗**: Skip
   - **i**: Learn more

### Step 3: View Saved Programs
1. Click "View Saved Programs" button
2. Review your saved list
3. Click "Apply Now" links to start applications
4. Return to swiping or logout

## API Integration

### Endpoints Used


#### POST /api/register
Register new user with farm profile
```json
{
  "email": "farmer@example.com",
  "password": "secure123",
  "acres": 150,
  "experience": 5,
  "state": "SC",
  "farmerType": ["beginning", "small"],
  "purposes": ["equipment", "operating_costs"]
}
```

#### POST /api/login
Authenticate existing user
```json
{
  "email": "farmer@example.com",
  "password": "secure123"
}
```

#### POST /api/match
Get AI-powered program matches
```json
{
  "acres": 150,
  "experience": 5,
  "state": "SC",
  "farmerType": ["beginning", "small"],
  "purposes": ["equipment", "operating_costs"]
}
```

**Response includes:**
- `matchingMethod`: "bedrock" or "rule-based"
- `isBestPick`: true for top match
- `matchPercentage`: 0-100
- `matchReasons`: Array of personalized reasons
- Full program details

## Technical Details

### Technologies
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js + Express
- **AI**: AWS Bedrock (Claude 3 Haiku)
- **Auth**: JWT tokens + localStorage
- **Styling**: Custom CSS with gradients and animations

### Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance
- Lazy loading of cards (3 at a time)
- Smooth 60fps animations
- Optimized touch events
- Minimal API calls

## Customization

### Colors
Main gradient: `#667eea` to `#764ba2`
- Primary button: `#667eea`
- Success (save): `#4caf50`
- Error (skip): `#ff4444`
- Info: `#2196f3`

### Card Stack
Shows 3 cards at once with stacking effect:
- Top card: 100% opacity, full size
- 2nd card: 80% opacity, 95% scale
- 3rd card: 60% opacity, 90% scale

### Swipe Threshold
- Minimum swipe distance: 100px
- Visual indicator appears at: 50px

## Troubleshooting

### "No matches found"
- Check if your state is supported (SC, NC, GA)
- Verify farm size and experience are within program ranges
- Try selecting different farmer types or purposes

### "Login failed"
- Verify email and password are correct
- Check if account exists (try registering)
- Clear browser cache and localStorage

### Cards not loading
- Ensure backend server is running on port 3000
- Check browser console for errors
- Verify API endpoints are accessible

### Swipe not working
- Try using the button controls instead
- Check if JavaScript is enabled
- Refresh the page

## Security

### Authentication
- Passwords are hashed with bcrypt
- JWT tokens expire after 24 hours
- Tokens stored in localStorage (client-side)

### Best Practices
- Use strong passwords
- Don't share your login credentials
- Logout when using shared devices
- Clear browser data on public computers

## Comparison with Other Interfaces

### vs. Original Swipe Interface
- ✅ Backend integration (was static)
- ✅ User authentication (was anonymous)
- ✅ AI-powered matching (was rule-based only)
- ✅ Saved programs persist (was session-only)
- ✅ Best Pick indicator
- ✅ Match reasons displayed

### vs. Standard Match Interface
- ✅ More engaging UX
- ✅ Mobile-optimized
- ✅ One program at a time (less overwhelming)
- ✅ Gamified experience
- ❌ Can't see all matches at once
- ❌ No side-by-side comparison

## Future Enhancements

Potential improvements:
- [ ] Undo last swipe
- [ ] Filter by program type
- [ ] Sort saved programs
- [ ] Share saved programs via email
- [ ] Export to PDF
- [ ] Push notifications for deadlines
- [ ] Social sharing
- [ ] Program comparison view
- [ ] Application tracking

## Support

For issues or questions:
1. Check this guide first
2. Review the main README.md
3. Check server logs for errors
4. Verify AWS Bedrock configuration

## Credits

Built for the Farm Funding Matcher project
- Backend: Express.js + AWS Bedrock
- Design: Tinder-inspired swipe interface
- AI: Claude 3 Haiku via AWS Bedrock
