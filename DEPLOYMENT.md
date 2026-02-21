# Deployment Guide - Smart Farm Funding Matcher

This guide covers deploying the Smart Farm Funding Matcher to various platforms.

## Prerequisites

- Git repository with your code
- Node.js application configured
- Environment variables ready

## Platform-Specific Deployment

### 1. Render (Recommended for MVP)

**Pros**: Free tier, automatic HTTPS, easy setup
**Cons**: Cold starts on free tier

#### Steps:

1. **Create Render Account**: https://render.com

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Configure:
     - Name: `farm-funding-matcher`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Instance Type: `Free` (or paid for production)

3. **Set Environment Variables**:
   ```
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   NODE_ENV=production
   AWS_ACCESS_KEY_ID=your_aws_key (optional)
   AWS_SECRET_ACCESS_KEY=your_aws_secret (optional)
   AWS_REGION=us-east-1
   BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
   BEDROCK_TIMEOUT=30000
   ```

4. **Deploy**: Click "Create Web Service"

5. **Access**: Your app will be at `https://farm-funding-matcher.onrender.com`

### 2. Heroku

**Pros**: Easy deployment, good documentation
**Cons**: No free tier anymore

#### Steps:

1. **Install Heroku CLI**:
```bash
npm install -g heroku
```

2. **Login**:
```bash
heroku login
```

3. **Create App**:
```bash
heroku create farm-funding-matcher
```

4. **Set Environment Variables**:
```bash
heroku config:set JWT_SECRET=your_jwt_secret_key
heroku config:set NODE_ENV=production
heroku config:set AWS_ACCESS_KEY_ID=your_aws_key
heroku config:set AWS_SECRET_ACCESS_KEY=your_aws_secret
heroku config:set AWS_REGION=us-east-1
heroku config:set BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
heroku config:set BEDROCK_TIMEOUT=30000
```

5. **Deploy**:
```bash
git push heroku main
```

6. **Open**:
```bash
heroku open
```

### 3. Railway

**Pros**: Simple, generous free tier
**Cons**: Newer platform

#### Steps:

1. **Create Railway Account**: https://railway.app

2. **New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure**:
   - Railway auto-detects Node.js
   - Add environment variables in Settings → Variables

4. **Deploy**: Automatic on push to main branch

5. **Access**: Railway provides a URL

### 4. AWS EC2 (Production)

**Pros**: Full control, scalable
**Cons**: More complex setup

#### Steps:

1. **Launch EC2 Instance**:
   - Ubuntu 22.04 LTS
   - t2.micro (free tier) or larger
   - Configure security group: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS)

2. **Connect via SSH**:
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

3. **Install Node.js**:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Install Git**:
```bash
sudo apt-get install git
```

5. **Clone Repository**:
```bash
git clone <your-repo-url>
cd farm-funding-matcher
```

6. **Install Dependencies**:
```bash
npm install
```

7. **Create .env File**:
```bash
nano .env
# Add your environment variables
```

8. **Install PM2**:
```bash
sudo npm install -g pm2
```

9. **Start Application**:
```bash
pm2 start server.js --name farm-funding-matcher
pm2 save
pm2 startup
```

10. **Setup Nginx (Optional)**:
```bash
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo systemctl restart nginx
```

11. **Setup SSL with Let's Encrypt**:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 5. DigitalOcean App Platform

**Pros**: Simple, good performance
**Cons**: Paid service

#### Steps:

1. **Create DigitalOcean Account**: https://digitalocean.com

2. **Create App**:
   - Click "Create" → "Apps"
   - Connect GitHub repository
   - Configure:
     - Name: `farm-funding-matcher`
     - Plan: Basic ($5/month)

3. **Environment Variables**:
   - Add in App Settings → Environment Variables

4. **Deploy**: Automatic

### 6. Vercel (Alternative)

**Note**: Vercel is optimized for serverless/static sites. For this Express app, consider using Vercel's serverless functions or choose another platform.

## Post-Deployment Checklist

### 1. Verify Deployment
- [ ] Application loads successfully
- [ ] Registration works
- [ ] Login works
- [ ] Matching returns results
- [ ] Session persistence works

### 2. Test AWS Bedrock Integration
- [ ] Check server logs for Bedrock status
- [ ] Test matching with valid AWS credentials
- [ ] Verify fallback works when Bedrock unavailable

### 3. Security
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] JWT secret is strong and unique
- [ ] AWS credentials have minimal permissions

### 4. Monitoring
- [ ] Set up error logging
- [ ] Monitor AWS Bedrock usage and costs
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)

### 5. Performance
- [ ] Test response times
- [ ] Verify cold start times (if applicable)
- [ ] Check memory usage

## Environment Variables Reference

Required for all deployments:

```env
# Application
JWT_SECRET=<strong-random-string>
PORT=3000
NODE_ENV=production

# AWS Bedrock (Optional - leave empty for fallback mode)
AWS_ACCESS_KEY_ID=<your-aws-access-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-key>
AWS_REGION=us-east-1

# Bedrock Configuration
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
BEDROCK_TIMEOUT=30000
```

## Troubleshooting Deployment Issues

### Application Won't Start
1. Check logs for errors
2. Verify all environment variables are set
3. Ensure PORT is correct
4. Check Node.js version compatibility

### Bedrock Not Working
1. Verify AWS credentials are correct
2. Check IAM permissions
3. Confirm Bedrock model access
4. Check AWS region availability
5. System should automatically fall back to rule-based scoring

### Database/Storage Issues
- This MVP uses in-memory storage
- Data is lost on restart
- For production, implement persistent storage (PostgreSQL, MongoDB)

### Performance Issues
1. Upgrade instance size
2. Enable caching
3. Optimize Bedrock timeout
4. Consider CDN for static assets

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (AWS ALB, Nginx)
- Deploy multiple instances
- Implement session store (Redis)
- Add database for persistence

### Vertical Scaling
- Increase instance size
- Add more memory
- Upgrade CPU

### Cost Optimization
- Monitor AWS Bedrock usage
- Implement caching for common queries
- Use free tiers where possible
- Set up billing alerts

## Backup and Recovery

### Data Backup (When using database)
- Regular automated backups
- Test restore procedures
- Store backups in different region

### Application Backup
- Keep code in Git
- Document configuration
- Save environment variables securely

## Monitoring and Logging

### Recommended Tools
- **Uptime**: UptimeRobot, Pingdom
- **Errors**: Sentry, Rollbar
- **Logs**: Papertrail, Loggly
- **Performance**: New Relic, Datadog
- **AWS**: CloudWatch for Bedrock metrics

### Key Metrics to Monitor
- Response time
- Error rate
- Bedrock API success rate
- Memory usage
- CPU usage
- Request volume

## Support and Maintenance

### Regular Tasks
- Update dependencies monthly
- Review AWS Bedrock costs
- Check security advisories
- Monitor error logs
- Test backup restoration

### Emergency Contacts
- AWS Support (if using Bedrock)
- Platform support (Render, Heroku, etc.)
- Development team

## Next Steps After Deployment

1. **Add Analytics**: Google Analytics, Mixpanel
2. **Implement Database**: PostgreSQL or MongoDB
3. **Add Email Notifications**: SendGrid, Mailgun
4. **Improve Monitoring**: Set up comprehensive logging
5. **Add Tests**: Unit tests, integration tests
6. **Documentation**: API documentation, user guide
7. **Feedback System**: User feedback collection

## Cost Estimates

### Render (Free Tier)
- Hosting: $0
- AWS Bedrock: ~$0.001-0.002 per match
- Total: ~$5-10/month for 5000 matches

### Heroku (Basic)
- Hosting: $7/month
- AWS Bedrock: ~$0.001-0.002 per match
- Total: ~$12-17/month for 5000 matches

### AWS EC2 (t2.micro)
- Hosting: $8.50/month
- AWS Bedrock: ~$0.001-0.002 per match
- Total: ~$13-18/month for 5000 matches

### Without AWS Bedrock
- Hosting only: $0-8.50/month depending on platform
- No AI costs (uses rule-based fallback)

## Conclusion

Choose the deployment platform based on your needs:
- **MVP/Testing**: Render (free tier)
- **Production (Simple)**: Railway or Render (paid)
- **Production (Control)**: AWS EC2 or DigitalOcean
- **Enterprise**: AWS with auto-scaling

Remember to:
- Always use HTTPS in production
- Keep environment variables secure
- Monitor costs and performance
- Have a backup plan
- Test thoroughly before going live
