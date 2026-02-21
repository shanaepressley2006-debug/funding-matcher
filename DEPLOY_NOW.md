# 🚀 Deploy Your App Now!

Choose your deployment method and get your Farm Funding Matcher live in minutes.

## Option 1: Quick Deploy (Recommended) ⭐

**Perfect for beginners and first-time deployments**

```bash
./quick-deploy.sh
```

This will:
1. ✓ Push your code to GitHub
2. ✓ Generate a secure JWT secret
3. ✓ Open AWS Amplify Console
4. ✓ Guide you through setup step-by-step

**Time:** ~10 minutes | **Difficulty:** Easy

---

## Option 2: Automated Deploy (Advanced) 🤖

**For users with AWS CLI and GitHub CLI set up**

```bash
./deploy-to-aws.sh
```

This will:
1. ✓ Verify all prerequisites
2. ✓ Push code to GitHub
3. ✓ Create AWS Amplify app
4. ✓ Configure everything automatically
5. ✓ Deploy and give you the live URL

**Time:** ~5 minutes | **Difficulty:** Advanced

---

## First Time? Start Here 👇

### 1. Make sure you have Git:
```bash
git --version
```

If not installed, get it from: https://git-scm.com/

### 2. Choose your method:
- **New to AWS?** → Use Quick Deploy
- **Have AWS CLI?** → Use Automated Deploy

### 3. Run the script:
```bash
# For Quick Deploy:
./quick-deploy.sh

# For Automated Deploy:
./deploy-to-aws.sh
```

### 4. Follow the prompts!

Both scripts will guide you through the process with clear, color-coded messages.

---

## What You'll Need

### For Quick Deploy:
- ✓ Git installed
- ✓ GitHub account (free)
- ✓ AWS account (free tier available)

### For Automated Deploy:
- ✓ Everything from Quick Deploy, plus:
- ✓ AWS CLI installed and configured
- ✓ GitHub CLI installed and authenticated
- ✓ GitHub personal access token

---

## After Deployment

Your app will be live at a URL like:
```
https://main.d1a2b3c4d5e6.amplifyapp.com
```

### Automatic Updates:
Every time you push to GitHub, your app automatically redeploys! 🎉

### Monitor Deployments:
Check the AWS Amplify Console to see deployment status and logs.

---

## Need Help?

1. **Read the full guide:** `DEPLOYMENT_SCRIPTS.md`
2. **Check AWS docs:** https://docs.aws.amazon.com/amplify/
3. **View comparison:** `cat .deployment-comparison.txt`

---

## Quick Troubleshooting

### "Permission denied" error:
```bash
chmod +x quick-deploy.sh deploy-to-aws.sh
```

### "Command not found":
Make sure you're in the project directory:
```bash
cd /path/to/your/project
ls -la *.sh
```

### AWS CLI not configured:
```bash
aws configure
```

### GitHub CLI not authenticated:
```bash
gh auth login
```

---

## Ready? Let's Deploy! 🚀

```bash
# Choose one:
./quick-deploy.sh      # Guided deployment
./deploy-to-aws.sh     # Automated deployment
```

**Your app will be live in minutes!**
