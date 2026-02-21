# 🚀 Deploy Match My Farm Website

Your Match My Farm app is ready to go live! Here are the easiest ways to deploy it.

## Files You Need

Make sure you have these files:
- ✅ `index.html` (landing page)
- ✅ `swipe-funding-matcher.html` (main app)

That's it! No server needed - it's a static website.

---

## Method 1: Netlify (EASIEST - 2 minutes)

### Steps:
1. Go to **https://app.netlify.com/drop**
2. Drag your entire folder into the drop zone
3. Done! You'll get a URL like: `https://random-name.netlify.app`

### To customize the URL:
1. Click "Site settings"
2. Click "Change site name"
3. Enter: `match-my-farm`
4. Your URL becomes: `https://match-my-farm.netlify.app`

**Pros:**
- ✅ Instant deployment
- ✅ Free forever
- ✅ Automatic HTTPS
- ✅ Custom domain support

---

## Method 2: GitHub Pages (FREE)

### Steps:
1. Create GitHub account: https://github.com/signup
2. Create new repository: "match-my-farm"
3. Upload your files:
   - Click "uploading an existing file"
   - Drag `index.html` and `swipe-funding-matcher.html`
   - Click "Commit changes"
4. Enable GitHub Pages:
   - Go to Settings → Pages
   - Source: Deploy from branch "main"
   - Click Save
5. Wait 2-3 minutes
6. Your site is live at: `https://yourusername.github.io/match-my-farm`

**Pros:**
- ✅ Free forever
- ✅ Version control included
- ✅ Easy updates (just upload new files)

---

## Method 3: Vercel (Fast & Professional)

### Steps:
1. Go to **https://vercel.com/signup**
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repo (or drag files)
5. Click "Deploy"
6. Done! URL: `https://match-my-farm.vercel.app`

**Pros:**
- ✅ Lightning fast
- ✅ Automatic deployments
- ✅ Free custom domain

---

## Method 4: Local Testing (Before Deploying)

Want to test locally first?

### Option A: Python (if installed)
```bash
python3 -m http.server 8000
```
Then open: http://localhost:8000

### Option B: Just open the file
```bash
open index.html
```

---

## 🎨 Custom Domain (Optional)

Want your own domain like `matchmyfarm.com`?

1. Buy domain from:
   - Namecheap: ~$10/year
   - Google Domains: ~$12/year
   - GoDaddy: ~$15/year

2. Connect to your hosting:
   - **Netlify:** Settings → Domain management → Add custom domain
   - **Vercel:** Settings → Domains → Add
   - **GitHub Pages:** Settings → Pages → Custom domain

---

## 📱 Share Your Website

Once deployed, share your link:
- 🔗 Direct link: `https://your-site.netlify.app`
- 📱 QR Code: Use https://qr-code-generator.com
- 📧 Email: Send link to farmers
- 📱 Social media: Share on Facebook, Twitter, etc.

---

## 🔄 Update Your Website

### Netlify:
- Drag new files to the same drop zone
- Or connect to GitHub for automatic updates

### GitHub Pages:
- Upload new files to your repository
- Changes go live in 2-3 minutes

### Vercel:
- Push to GitHub
- Automatic deployment

---

## ✅ Checklist Before Going Live

- [ ] Test on your phone
- [ ] Test on desktop
- [ ] Click all links to make sure they work
- [ ] Try the swipe feature
- [ ] Fill out the form and test matching
- [ ] Check that saved programs work

---

## 🆘 Troubleshooting

**Problem:** Links don't work
- **Solution:** Make sure both HTML files are in the same folder

**Problem:** Site looks broken
- **Solution:** Clear browser cache (Cmd+Shift+R on Mac)

**Problem:** Can't swipe on mobile
- **Solution:** Make sure you're using a modern browser (Chrome, Safari)

---

## 🎉 You're Done!

Your Match My Farm website is now live and helping farmers find funding!

**Next Steps:**
1. Share with farmers in your community
2. Get feedback
3. Add more programs to the database
4. Consider adding analytics (Google Analytics)

Good luck! 🌱
