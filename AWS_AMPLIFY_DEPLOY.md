# AWS Amplify Deployment Guide - Match My Farm

Complete step-by-step guide to deploy Match My Farm (Node.js Express app) to AWS Amplify with auto-deploy from GitHub.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Amplify Console Setup](#amplify-console-setup)
3. [Build Settings Configuration](#build-settings-configuration)
4. [Environment Variables Setup](#environment-variables-setup)
5. [Custom Domain Setup](#custom-domain-setup-optional)
6. [Monitoring and Logs](#monitoring-and-logs)
7. [Troubleshooting Common Issues](#troubleshooting-common-issues)
8. [Cost Estimates](#cost-estimates)
9. [Auto-Deploy from GitHub](#auto-deploy-from-github-setup)

---

## 1. Prerequisites

### Required Items

✅ **AWS Account**
- Sign up at https://aws.amazon.com
- Credit card required (free tier available)
- Verify email address

✅ **GitHub Repository**
- Push your Match My Farm code to GitHub
- Repository can be public or private
- Ensure all files are committed

✅ **AWS Bedrock Access** (Optional but Recommended)
- Go to AWS Bedrock console
- Request access to Claude 3 Haiku model
- Approval is usually instant
- Required for AI-powered matching (app works without it)

✅ **IAM User with Bedrock Permissions**
- Create IAM user with programmatic access
- Attach policy with `bedrock:InvokeModel` permission
- Save Access Key ID and Secret Access Key

### Quick IAM Policy for Bedrock

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

---

## 2. Amplify Console Setup

### Step 1: Access Amplify Console

1. Log into AWS Console (https://console.aws.amazon.com)
2. Search for "Amplify" in the services search bar
3. Click "AWS Amplify" to open the console
4. Click **"New app"** → **"Host web app"**

**Screenshot description**: You'll see the Amplify landing page with a large orange "New app" button in the top right.

### Step 2: Connect GitHub Repository

1. Select **"GitHub"** as your Git provider
2. Click **"Continue"**
3. Authorize AWS Amplify to access your GitHub account
   - A popup will appear asking for GitHub permissions
   - Click "Authorize aws-amplify-console"
4. Select your repository from the dropdown
5. Select the branch to deploy (usually `main` or `master`)
6. Click **"Next"**

**Screenshot description**: You'll see a list of your GitHub repositories with a search bar. Select "farm-funding-matcher" or your repo name.

### Step 3: Configure App Settings

1. **App name**: Enter "match-my-farm" (or your preferred name)
2. **Environment**: Leave as "production" or customize
3. **Service role**: 
   - If first time: Select "Create new service role"
   - If exists: Select existing "amplifyconsole-backend-role"
4. Check **"Enable full-stack CI/CD"** (important for Node.js apps)
5. Click **"Next"**

**Screenshot description**: Form with app name field, environment dropdown, and service role selection.

---

## 3. Build Settings Configuration

### Step 1: Edit Build Settings

Amplify will auto-detect your app type. You need to customize the build settings for Node.js Express.

1. On the "Build settings" page, click **"Edit"** next to the YAML configuration
2. Replace the entire YAML with the configuration below
3. Click **"Save"**

### Step 2: Use This amplify.yml Configuration

Create `amplify.yml` in your repository root (or paste in Amplify console):

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - echo "Build completed"
  artifacts:
    baseDirectory: /
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
backend:
  phases:
    build:
      commands:
        - npm ci --production
```

### Step 3: Advanced Settings

1. **Build image**: Select "Amazon Linux:2023" (latest)
2. **Build timeout**: Set to 10 minutes (default is fine)
3. **Live package updates**: Enable for automatic security patches
4. Click **"Next"**

**Important**: Amplify will run `npm start` automatically to start your Express server.

---

## 4. Environment Variables Setup

### Step 1: Add Environment Variables

1. In Amplify Console, go to **"App settings"** → **"Environment variables"**
2. Click **"Manage variables"**
3. Add the following variables:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `JWT_SECRET` | `your_random_secret_key_here` | Generate a strong random string (32+ chars) |
| `PORT` | `3000` | Express server port |
| `NODE_ENV` | `production` | Environment mode |
| `AWS_ACCESS_KEY_ID` | `your_bedrock_access_key` | IAM user access key for Bedrock |
| `AWS_SECRET_ACCESS_KEY` | `your_bedrock_secret_key` | IAM user secret key for Bedrock |
| `AWS_REGION` | `us-east-1` | AWS region for Bedrock |
| `BEDROCK_MODEL_ID` | `anthropic.claude-3-haiku-20240307-v1:0` | Claude model ID |
| `BEDROCK_TIMEOUT` | `30000` | Bedrock timeout in milliseconds |

### Step 2: Generate JWT Secret

Use this command to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`.

### Step 3: Save Variables

1. Click **"Save"** after adding all variables
2. Variables are encrypted at rest
3. They'll be available to your app at runtime

**Security Note**: Never commit these values to GitHub. Use Amplify environment variables only.

---

## 5. Custom Domain Setup (Optional)

### Step 1: Add Custom Domain

1. Go to **"App settings"** → **"Domain management"**
2. Click **"Add domain"**
3. Enter your domain name (e.g., `matchmyfarm.com`)
4. Click **"Configure domain"**

### Step 2: DNS Configuration

Amplify will provide DNS records to add to your domain registrar:

**For Root Domain**:
- Type: `A` or `ALIAS`
- Name: `@` or leave blank
- Value: Amplify-provided value

**For www Subdomain**:
- Type: `CNAME`
- Name: `www`
- Value: Amplify-provided value

### Step 3: SSL Certificate

- Amplify automatically provisions SSL certificates via AWS Certificate Manager
- HTTPS is enabled by default
- Certificate renewal is automatic
- Wait 5-10 minutes for DNS propagation

### Step 4: Verify Domain

1. Wait for "Available" status in Amplify console
2. Visit your domain: `https://yourdomain.com`
3. Verify SSL certificate (green padlock in browser)

---

## 6. Monitoring and Logs

### Access Logs

1. Go to your app in Amplify Console
2. Click on the deployment you want to inspect
3. View logs in real-time during deployment

**Log Types**:
- **Provision**: Infrastructure setup logs
- **Build**: npm install and build command logs
- **Deploy**: Deployment process logs
- **Server**: Application runtime logs (stdout/stderr)

### View Application Logs

1. Go to **"Monitoring"** tab in Amplify Console
2. Click **"View logs in CloudWatch"**
3. Select log stream to view server logs

**Useful CloudWatch Insights Queries**:

```sql
# Find errors in last hour
fields @timestamp, @message
| filter @message like /error/i
| sort @timestamp desc
| limit 100
```

```sql
# Monitor API response times
fields @timestamp, @message
| filter @message like /POST|GET/
| sort @timestamp desc
```

### Monitoring Metrics

Available in **"Monitoring"** tab:
- **Requests**: Total HTTP requests
- **Data Transfer**: Bandwidth usage
- **4xx Errors**: Client errors
- **5xx Errors**: Server errors
- **Latency**: Response time metrics

### Set Up Alarms

1. Go to CloudWatch Console
2. Create alarm for 5xx errors > 10 in 5 minutes
3. Add SNS topic for email notifications
4. Link alarm to your Amplify app

---

## 7. Troubleshooting Common Issues

### Issue 1: Build Fails with "npm install" Error

**Symptoms**: Build fails during dependency installation

**Solutions**:
```yaml
# Use npm ci instead of npm install in amplify.yml
preBuild:
  commands:
    - npm ci --legacy-peer-deps
```

Or clear cache:
1. Go to **"App settings"** → **"Build settings"**
2. Click **"Clear cache"**
3. Redeploy

### Issue 2: App Shows "502 Bad Gateway"

**Symptoms**: Deployment succeeds but app doesn't load

**Solutions**:
1. Check `PORT` environment variable is set to `3000`
2. Verify `server.js` uses `process.env.PORT`
3. Check server logs in CloudWatch for startup errors
4. Ensure `npm start` command is correct in `package.json`

### Issue 3: Environment Variables Not Working

**Symptoms**: App can't access AWS Bedrock or JWT fails

**Solutions**:
1. Verify variables are saved in Amplify Console
2. Redeploy after adding variables (required)
3. Check variable names match exactly (case-sensitive)
4. View logs to confirm variables are loaded

### Issue 4: Bedrock "Access Denied" Error

**Symptoms**: AI matching fails with 403 error

**Solutions**:
1. Verify Bedrock model access in AWS Console
2. Check IAM user has `bedrock:InvokeModel` permission
3. Confirm `AWS_REGION` matches Bedrock availability (use `us-east-1`)
4. Test IAM credentials locally first

### Issue 5: Slow Build Times

**Symptoms**: Builds take >5 minutes

**Solutions**:
```yaml
# Enable caching in amplify.yml
cache:
  paths:
    - node_modules/**/*
```

Or use `npm ci` instead of `npm install` (faster).

### Issue 6: Auto-Deploy Not Triggering

**Symptoms**: GitHub pushes don't trigger deployments

**Solutions**:
1. Check webhook in GitHub repo settings
2. Verify branch name matches Amplify configuration
3. Re-authorize GitHub connection in Amplify
4. Check Amplify service role has correct permissions

### Issue 7: Memory or Timeout Errors

**Symptoms**: App crashes or times out under load

**Solutions**:
1. Increase build timeout in Amplify settings
2. Optimize code to reduce memory usage
3. Consider upgrading to Amplify Compute (more resources)
4. Add error handling for long-running operations

---

## 8. Cost Estimates

### AWS Amplify Pricing (as of 2024)

**Build & Deploy**:
- Build minutes: $0.01 per minute
- Typical build: 2-3 minutes = $0.02-$0.03 per deployment
- Free tier: 1,000 build minutes/month

**Hosting**:
- Storage: $0.023 per GB/month
- Data transfer: $0.15 per GB served
- Free tier: 15 GB served/month, 5 GB storage

**Typical Monthly Costs**:

| Usage Level | Builds/Month | Traffic | Estimated Cost |
|------------|--------------|---------|----------------|
| **Development** | 50 builds | 5 GB | **$0** (free tier) |
| **Small Production** | 100 builds | 20 GB | **$1-2** |
| **Medium Production** | 200 builds | 100 GB | **$15-20** |
| **High Traffic** | 500 builds | 500 GB | **$80-100** |

### AWS Bedrock Pricing

**Claude 3 Haiku**:
- Input: $0.00025 per 1K tokens (~750 words)
- Output: $0.00125 per 1K tokens
- Typical match request: ~500 input + 200 output tokens = **$0.0004 per match**

**Monthly Bedrock Costs**:
- 1,000 matches: **$0.40**
- 10,000 matches: **$4.00**
- 100,000 matches: **$40.00**

### Total Estimated Monthly Cost

| Scenario | Amplify | Bedrock | **Total** |
|----------|---------|---------|-----------|
| **MVP/Testing** | $0 | $0.40 | **$0.40** |
| **Small App** | $2 | $4 | **$6** |
| **Growing App** | $20 | $40 | **$60** |

**Cost Optimization Tips**:
- Use free tier during development
- Enable caching to reduce build times
- Optimize images and assets to reduce data transfer
- Monitor usage in AWS Cost Explorer
- Set up billing alerts at $10, $50, $100

---

## 9. Auto-Deploy from GitHub Setup

### Step 1: Enable Auto-Deploy

Auto-deploy is enabled by default when you connect GitHub. Every push to your selected branch triggers a deployment.

**Verify Auto-Deploy**:
1. Go to **"App settings"** → **"Build settings"**
2. Confirm "Continuous deployment" is **ON**
3. Check branch name matches your GitHub branch

### Step 2: Configure Branch Deployments

Deploy multiple branches for staging/production:

1. Go to **"App settings"** → **"Branch management"**
2. Click **"Connect branch"**
3. Select branch (e.g., `develop`, `staging`)
4. Each branch gets its own URL: `https://develop.xxxxx.amplifyapp.com`

### Step 3: Set Up Pull Request Previews

Preview changes before merging:

1. Go to **"App settings"** → **"Previews"**
2. Click **"Enable previews"**
3. Select branches to preview (e.g., all PRs to `main`)
4. Each PR gets a unique preview URL

**Benefits**:
- Test changes before merging
- Share preview links with team
- Automatic cleanup when PR closes

### Step 4: Customize Build Triggers

Control when builds run:

1. Go to **"App settings"** → **"Build settings"**
2. Scroll to **"Build triggers"**
3. Options:
   - **All commits**: Build on every push (default)
   - **Only on specific paths**: Build only when certain files change
   - **Manual only**: Disable auto-deploy

**Example: Build only on backend changes**:
```yaml
# In amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - |
          if git diff --name-only HEAD^ HEAD | grep -qE '^(server\.js|services/|models/)'; then
            echo "Backend changes detected, building..."
          else
            echo "No backend changes, skipping build"
            exit 0
          fi
```

### Step 5: Webhook Configuration

Amplify automatically creates a webhook in your GitHub repo.

**Verify Webhook**:
1. Go to your GitHub repo
2. Click **"Settings"** → **"Webhooks"**
3. You should see an AWS Amplify webhook
4. Check "Recent Deliveries" for successful pings

**If webhook is missing**:
1. In Amplify Console, go to **"App settings"** → **"General"**
2. Click **"Reconnect repository"**
3. Re-authorize GitHub access

### Step 6: Deployment Notifications

Get notified of deployment status:

1. Go to **"App settings"** → **"Notifications"**
2. Click **"Create notification rule"**
3. Select events:
   - Deployment started
   - Deployment succeeded
   - Deployment failed
4. Choose notification method:
   - Email (via SNS)
   - Slack (via webhook)
   - AWS Chatbot

**Example Slack Notification**:
1. Create SNS topic in AWS Console
2. Add Slack webhook as subscription
3. Link SNS topic to Amplify notifications

### Step 7: Rollback Strategy

If a deployment breaks production:

**Option 1: Redeploy Previous Version**
1. Go to deployment history
2. Find last working deployment
3. Click **"Redeploy this version"**

**Option 2: Revert Git Commit**
```bash
git revert HEAD
git push origin main
```
Amplify will auto-deploy the reverted code.

**Option 3: Disable Auto-Deploy**
1. Go to **"App settings"** → **"Build settings"**
2. Turn off "Continuous deployment"
3. Fix issue locally
4. Manually trigger deployment when ready

---

## 🚀 Quick Deployment Checklist

Use this checklist for fast deployment:

- [ ] AWS account created and verified
- [ ] GitHub repo pushed with all code
- [ ] IAM user created with Bedrock permissions
- [ ] JWT secret generated
- [ ] Amplify app created and connected to GitHub
- [ ] `amplify.yml` added to repo root
- [ ] Environment variables configured in Amplify
- [ ] Build settings verified
- [ ] First deployment triggered
- [ ] App tested at Amplify URL
- [ ] Logs checked for errors
- [ ] Custom domain added (optional)
- [ ] Auto-deploy verified with test commit
- [ ] Monitoring and alarms set up

---

## 📚 Additional Resources

- **AWS Amplify Docs**: https://docs.amplify.aws/
- **AWS Bedrock Docs**: https://docs.aws.amazon.com/bedrock/
- **Node.js on Amplify**: https://docs.amplify.aws/guides/hosting/nodejs/
- **Amplify CLI**: https://docs.amplify.aws/cli/
- **Cost Calculator**: https://calculator.aws/
- **AWS Support**: https://console.aws.amazon.com/support/

---

## 🎯 Competition-Ready Tips

1. **Deploy Early**: Get your app live ASAP, iterate later
2. **Use Free Tier**: Stay within limits during hackathon
3. **Monitor Costs**: Set billing alerts at $10
4. **Test Thoroughly**: Use preview URLs for testing
5. **Document Everything**: Keep this guide handy
6. **Have Backup**: Keep local version running
7. **Demo URL Ready**: Share Amplify URL with judges
8. **SSL Enabled**: HTTPS builds trust
9. **Fast Loading**: Optimize assets for speed
10. **Error Handling**: Graceful fallbacks for Bedrock

---

## ✅ Success Indicators

Your deployment is successful when:

- ✅ Amplify URL loads the app
- ✅ Registration and login work
- ✅ Matching returns results
- ✅ No errors in CloudWatch logs
- ✅ HTTPS certificate is valid
- ✅ Auto-deploy triggers on git push
- ✅ Environment variables are loaded
- ✅ Bedrock AI matching works (or fallback activates)

---

**Need Help?** Check the troubleshooting section or AWS Amplify documentation.

**Ready to Deploy?** Follow the checklist above and you'll be live in 15 minutes!

Good luck with your hackathon! 🚀🌾
