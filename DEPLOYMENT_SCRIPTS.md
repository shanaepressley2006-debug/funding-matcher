# Deployment Scripts Guide

Two deployment scripts are available to help you deploy the Farm Funding Matcher to AWS Amplify.

## Quick Deploy (Recommended for Beginners)

**Script:** `quick-deploy.sh`

This script provides a guided, semi-automated deployment process:

### What it does:
- ✓ Checks prerequisites (Git)
- ✓ Generates JWT secret automatically
- ✓ Commits and pushes code to GitHub
- ✓ Opens AWS Amplify Console in your browser
- ✓ Provides step-by-step instructions

### Usage:
```bash
./quick-deploy.sh
```

### Prerequisites:
- Git installed
- GitHub repository created (or script will guide you)
- AWS account (free tier works)

### Time: ~10 minutes (including manual steps)

---

## Automated Deploy (Advanced)

**Script:** `deploy-to-aws.sh`

This script fully automates the deployment process using AWS CLI.

### What it does:
- ✓ Checks all prerequisites
- ✓ Generates JWT secret automatically
- ✓ Commits and pushes code to GitHub
- ✓ Creates AWS Amplify app via CLI
- ✓ Configures environment variables
- ✓ Triggers deployment automatically
- ✓ Waits for completion and outputs live URL

### Usage:
```bash
./deploy-to-aws.sh
```

### Prerequisites:
- Git installed
- AWS CLI installed and configured (`aws configure`)
- GitHub CLI installed and authenticated (`gh auth login`)
- GitHub personal access token with 'repo' scope

### Time: ~5-10 minutes (fully automated)

---

## Which Script Should I Use?

### Use `quick-deploy.sh` if:
- You're new to AWS or command-line tools
- You prefer a visual interface (AWS Console)
- You don't have AWS CLI or GitHub CLI installed
- You want more control over each step

### Use `deploy-to-aws.sh` if:
- You're comfortable with command-line tools
- You have AWS CLI and GitHub CLI set up
- You want a fully automated deployment
- You're deploying multiple times

---

## Installation Prerequisites

### For Quick Deploy:
```bash
# Install Git (if not already installed)
# macOS:
brew install git

# Ubuntu/Debian:
sudo apt-get install git

# Windows:
# Download from https://git-scm.com/
```

### For Automated Deploy:
```bash
# Install AWS CLI
# macOS:
brew install awscli

# Ubuntu/Debian:
sudo apt-get install awscli

# Windows:
# Download from https://aws.amazon.com/cli/

# Configure AWS CLI
aws configure

# Install GitHub CLI
# macOS:
brew install gh

# Ubuntu/Debian:
sudo apt-get install gh

# Windows:
# Download from https://cli.github.com/

# Authenticate GitHub CLI
gh auth login
```

---

## Features

### Both Scripts Include:
- ✓ Automatic JWT secret generation
- ✓ Color-coded output for easy reading
- ✓ Error handling and validation
- ✓ Clear success/failure messages
- ✓ Helpful prompts and guidance

### Security:
- JWT secrets are generated using OpenSSL (cryptographically secure)
- Secrets are never logged or displayed in full
- Option to save secrets to `.env.production` (auto-added to `.gitignore`)

---

## Troubleshooting

### "Command not found" errors:
- Make sure scripts are executable: `chmod +x *.sh`
- Check prerequisites are installed

### AWS CLI authentication issues:
- Run `aws configure` and enter your credentials
- Verify with `aws sts get-caller-identity`

### GitHub authentication issues:
- Run `gh auth login` and follow prompts
- Verify with `gh auth status`

### Deployment fails:
- Check AWS Amplify console for detailed logs
- Verify environment variables are set correctly
- Ensure your AWS account has Amplify permissions

---

## After Deployment

### Your app will be live at:
```
https://[branch].[app-id].amplifyapp.com
```

### Automatic deployments:
- Every push to your connected branch triggers a new deployment
- Monitor deployments in the AWS Amplify Console

### Update environment variables:
- AWS Console: App Settings → Environment variables
- Or use AWS CLI: `aws amplify update-app`

---

## Support

- AWS Amplify Documentation: https://docs.aws.amazon.com/amplify/
- AWS CLI Documentation: https://docs.aws.amazon.com/cli/
- GitHub CLI Documentation: https://cli.github.com/manual/

---

## Example Output

### Quick Deploy:
```
═══════════════════════════════════════════════════
  Farm Funding Matcher - Quick Deploy
═══════════════════════════════════════════════════

✓ Git is installed
✓ Remote repository: https://github.com/user/repo
✓ Code pushed to GitHub successfully!

Your JWT Secret:
abc123xyz789...

Opening AWS Amplify Console...
```

### Automated Deploy:
```
═══════════════════════════════════════════════════
  Farm Funding Matcher - AWS Amplify Deployment
═══════════════════════════════════════════════════

✓ Git is installed
✓ AWS CLI is installed
✓ GitHub CLI is installed
✓ AWS credentials are configured
✓ Amplify app created with ID: d1a2b3c4d5e6
✓ Deployment completed successfully!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Live URL: https://main.d1a2b3c4d5e6.amplifyapp.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
