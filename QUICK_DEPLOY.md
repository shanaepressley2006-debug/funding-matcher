# 🚀 Quick Deploy Guide - Match My Farm

Get your app live in **under 10 minutes** for the funding competition!

## Prerequisites
- GitHub account
- Render account (free tier) - [Sign up here](https://render.com)
- Your code pushed to GitHub

---

## Step 1: Push to GitHub (2 minutes)

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment - Match My Farm"

# Create GitHub repo and push
# Go to github.com/new and create a new repository
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/match-my-farm.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Render (5 minutes)

### Option A: Automatic Deploy (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will detect `render.yaml` and configure everything automatically
5. Click **"Apply"** to start deployment

### Option B: Manual Deploy
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: match-my-farm
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Click **"Create Web Service"**

---

## Step 3: Set Environment Variables (2 minutes)

In your Render service dashboard:

1. Go to **"Environment"** tab
2. Add these variables:

### Required (App will work without AWS):
```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-change-this-123456
```

### Optional (For AI-powered matching):
```
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
```

**Note**: The app works perfectly without AWS credentials - it uses a smart rule-based fallback system!

3. Click **"Save Changes"** (this will trigger a redeploy)

---

## Step 4: Get Your Live URL (Instant)

Once deployment completes (2-3 minutes):

1. Your app will be live at: `https://match-my-farm.onrender.com`
2. Copy this URL for your competition submission
3. Test it immediately!

---

## Step 5: Test Your Deployment (1 minute)

Visit your live URL and test:

1. ✅ Homepage loads
2. ✅ Click "Get Started" or "Find Funding"
3. ✅ Fill out the farm profile form
4. ✅ Submit and see funding matches
5. ✅ Try the swipe interface

---

## 🎯 Competition Submission Checklist

- [ ] App is live and accessible
- [ ] All features work (matching, swipe interface)
- [ ] No console errors
- [ ] Mobile-responsive
- [ ] Fast loading time
- [ ] Live URL copied for submission

---

## 🔧 Troubleshooting

### Deployment Failed?
- Check build logs in Render dashboard
- Ensure `package.json` has all dependencies
- Verify Node version compatibility

### App Not Loading?
- Check service logs in Render dashboard
- Verify environment variables are set
- Ensure PORT is set to 10000

### Features Not Working?
- Open browser console (F12) for errors
- Check that JWT_SECRET is set
- Verify API endpoints are responding

---

## 🚀 Quick Updates

To update your live app:

```bash
# Make changes to your code
git add .
git commit -m "Update: description of changes"
git push

# Render auto-deploys from main branch!
# Your changes will be live in 2-3 minutes
```

---

## 📱 Share Your Live App

Your competition URL:
```
https://match-my-farm.onrender.com
```

**Pro Tip**: Render free tier may sleep after inactivity. First load might take 30 seconds. Keep it awake by visiting it regularly!

---

## 🎉 You're Live!

Your Match My Farm app is now accessible worldwide. Good luck with the competition! 🌾

**Need help?** Check the logs in Render dashboard or review the main README.md for detailed documentation.
