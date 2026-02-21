# Farm Funding Matcher - Full Stack Application

A full-stack web application with authentication that matches farmers with funding programs based on their farm profile.

## Features

- ✅ User Registration & Login with JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Farm profile management (acres, experience, state)
- ✅ Smart matching algorithm for funding programs
- ✅ Persistent login with localStorage
- ✅ Beautiful, responsive UI
- ✅ Real USDA funding programs

## Tech Stack

**Backend:**
- Node.js
- Express.js
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)

**Frontend:**
- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start the server:**
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

3. **Open in browser:**
```
http://localhost:5000
```

## Project Structure

```
├── server.js           # Express server with API routes
├── package.json        # Dependencies
├── public/
│   ├── index.html     # Frontend HTML
│   ├── styles.css     # Styling
│   └── app.js         # Frontend JavaScript
└── README-SERVER.md   # This file
```

## API Endpoints

### Authentication

**POST /api/register**
- Register a new user
- Body: `{ email, password, acres, experience, state }`
- Returns: `{ message }`

**POST /api/login**
- Login existing user
- Body: `{ email, password }`
- Returns: `{ token, user }`

### Matching

**POST /api/match**
- Get matching funding programs
- Body: `{ acres, experience, state }`
- Returns: Array of matching programs

**GET /api/programs**
- Get all available programs
- Returns: Array of all programs

## How It Works

1. **User registers** with email, password, and farm profile
2. **Password is hashed** using bcrypt before storage
3. **User logs in** and receives a JWT token
4. **Token is stored** in localStorage for persistent login
5. **Matching algorithm** filters programs based on:
   - Years of experience (min/max range)
   - Farm size in acres
   - State location
6. **Results are sorted** by relevance (grants first, then by experience match)

## Funding Programs Included

1. USDA Beginning Farmer Loan ($600,000)
2. EQIP Conservation Program ($450,000)
3. Young Farmer Grant ($100,000)
4. FSA Microloans ($50,000)
5. Farmer Bridge Assistance Program (varies)

## Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT token authentication
- ✅ Passwords never sent back to client
- ✅ Input validation on both client and server

## Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Profile editing
- [ ] More detailed program information
- [ ] Application tracking
- [ ] Admin dashboard

## Troubleshooting

**Port already in use:**
```bash
# Change PORT in server.js or set environment variable
PORT=3000 npm start
```

**Dependencies not installing:**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## License

MIT
