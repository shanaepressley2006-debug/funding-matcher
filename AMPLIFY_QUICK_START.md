# AWS Amplify - 15 Minute Quick Start

Fast-track deployment guide for Match My Farm to AWS Amplify.

---

## ⚡ Prerequisites (5 minutes)

1. **AWS Account**: https://aws.amazon.com (credit card required)
2. **GitHub Repo**: Push your code to GitHub
3. **Generate JWT Secret**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
4. **Get AWS Bedrock Keys** (optional):
   - IAM Console → Create User → Attach Bedrock policy
   - Save Access Key ID and Secret Key

---

## 🚀 Deploy Steps (10 minutes)

### 1. Create Amplify App (3 min)
- AWS Console → Search "Amplify"
- Click "New app" → "Host web app"
- Connect GitHub → Select repo → Select branch
- Click "Next"

### 2. Configure Build (2 min)
- App name: `match-my-farm`
- Enable "Full-stack CI/CD"
- Edit YAML → Paste from `amplify.yml` file
- Click "Next"

### 3. Add Environment Variables (3 min)
Go to "Environment variables" and add:

```
JWT_SECRET=<your_generated_secret>
PORT=3000
NODE_ENV=production
AWS_ACCESS_KEY_ID=<your_bedrock_key>
AWS_SECRET_ACCESS_KEY=<your_bedrock_secret>
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
BEDROCK_TIMEOUT=30000
```

### 4. Deploy (2 min)
- Click "Save and deploy"
- Wait for build to complete (~2-3 minutes)
- Click the Amplify URL to test

---

## ✅ Verify Deployment

- [ ] App loads at Amplify URL
- [ ] Can register new user
- [ ] Can login
- [ ] Matching returns results
- [ ] No errors in logs

---

## 🔧 Quick Fixes

**Build fails?**
```bash
# Clear cache in Amplify Console
App settings → Build settings → Clear cache
```

**502 Error?**
- Check PORT=3000 in environment variables
- Verify server.js uses process.env.PORT

**Bedrock not working?**
- App will use rule-based fallback automatically
- Check IAM permissions if you want AI matching

---

## 📊 Monitor

- **Logs**: Amplify Console → Click deployment → View logs
- **Metrics**: Monitoring tab → View CloudWatch
- **Costs**: AWS Billing Dashboard

---

## 🔄 Auto-Deploy

Every `git push` to your branch triggers automatic deployment.

Test it:
```bash
git commit -m "test deploy" --allow-empty
git push origin main
```

Watch deployment in Amplify Console.

---

## 💰 Costs

**Free Tier**: 1,000 build minutes + 15 GB traffic/month

**Typical Costs**:
- Development: $0/month (free tier)
- Small app: $1-2/month
- Bedrock AI: $0.0004 per match request

---

## 🆘 Need Help?

See full guide: `AWS_AMPLIFY_DEPLOY.md`

**Common Issues**:
1. Build fails → Check `amplify.yml` syntax
2. 502 error → Verify PORT environment variable
3. Auto-deploy not working → Check GitHub webhook
4. Bedrock errors → Verify IAM permissions

---

## 🎯 Competition Tips

1. Deploy early, iterate later
2. Use Amplify URL for demos
3. Set billing alert at $10
4. Keep local backup running
5. Test before presenting

---

**Your app will be live at**: `https://main.xxxxx.amplifyapp.com`

Good luck! 🚀
