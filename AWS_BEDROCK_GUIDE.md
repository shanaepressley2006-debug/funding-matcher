# AWS Bedrock Integration Guide

## What is AWS Bedrock?

AWS Bedrock is Amazon's managed AI service that provides access to foundation models from leading AI companies. For this application, we use **Claude 3 Haiku** by Anthropic for intelligent program matching.

## Why Use Bedrock?

### AI-Powered Matching Benefits:
1. **Natural Language Understanding**: Analyzes farmer profiles with human-like comprehension
2. **Nuanced Reasoning**: Considers factors beyond simple rules
3. **Better Explanations**: Provides detailed, contextual match reasons
4. **Adaptive**: Can understand complex eligibility criteria
5. **Improved Accuracy**: Often finds better matches than rule-based systems

### Example Comparison:

**Rule-Based Output**:
```
✓ You qualify as a beginning farmer (5 years)
✓ Perfect for small-scale operations (150 acres)
✓ Available in SC
```

**Bedrock AI Output**:
```
• Your 5 years of experience aligns perfectly with this program's focus on beginning farmers who are establishing their operations
• At 150 acres, your farm size is ideal for this microloan program designed specifically for small-scale producers
• This program has strong presence in South Carolina with dedicated support staff
• The fast 2-3 week approval timeline matches well with your immediate equipment needs
```

## Setting Up AWS Bedrock

### Step 1: Create AWS Account

1. Go to https://aws.amazon.com
2. Click "Create an AWS Account"
3. Follow the registration process
4. Add payment method (required, but Bedrock has free tier)

### Step 2: Enable Bedrock Access

1. Sign in to AWS Console
2. Search for "Bedrock" in the services search
3. Click "Amazon Bedrock"
4. Go to "Model access" in the left sidebar
5. Click "Manage model access"
6. Find "Claude 3 Haiku" by Anthropic
7. Check the box next to it
8. Click "Request model access"
9. Wait for approval (usually instant)

### Step 3: Create IAM User

1. Go to IAM service in AWS Console
2. Click "Users" → "Add users"
3. User name: `farm-funding-matcher-bedrock`
4. Select "Access key - Programmatic access"
5. Click "Next: Permissions"

### Step 4: Set Permissions

Create a custom policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": [
        "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-haiku-20240307-v1:0"
      ]
    }
  ]
}
```

Steps:
1. Click "Attach policies directly"
2. Click "Create policy"
3. Click "JSON" tab
4. Paste the policy above
5. Click "Next: Tags" → "Next: Review"
6. Name: `BedrockInvokeHaikuOnly`
7. Click "Create policy"
8. Go back to user creation
9. Refresh policies and select your new policy
10. Click "Next: Tags" → "Next: Review" → "Create user"

### Step 5: Get Credentials

1. After user creation, you'll see Access Key ID and Secret Access Key
2. **IMPORTANT**: Copy both immediately - you can't see the secret again!
3. Store them securely

### Step 6: Configure Application

Add to your `.env` file:

```env
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
BEDROCK_TIMEOUT=30000
```

### Step 7: Test Connection

Start your server:
```bash
npm start
```

Look for:
```
✅ AWS Bedrock client initialized successfully
🤖 AWS Bedrock: Configured
```

## Bedrock Regions

Claude 3 Haiku is available in:
- `us-east-1` (US East - N. Virginia) - **Recommended**
- `us-west-2` (US West - Oregon)
- `eu-west-1` (Europe - Ireland)
- `ap-southeast-1` (Asia Pacific - Singapore)

Choose the region closest to your users for best performance.

## Cost Analysis

### Pricing (as of 2024)
- **Input**: $0.00025 per 1K tokens (~750 words)
- **Output**: $0.00125 per 1K tokens (~750 words)

### Per Match Request
- Input: ~1,500 tokens (farmer profile + 8 programs)
- Output: ~500 tokens (scores + reasons)
- **Cost per match**: ~$0.001 - $0.002

### Monthly Estimates

| Monthly Matches | Cost |
|----------------|------|
| 100 | $0.10 - $0.20 |
| 1,000 | $1.00 - $2.00 |
| 5,000 | $5.00 - $10.00 |
| 10,000 | $10.00 - $20.00 |
| 50,000 | $50.00 - $100.00 |

**Very affordable for MVP and small-scale production!**

### Cost Optimization Tips
1. Use 30-second timeout (already configured)
2. Cache results for identical profiles (future enhancement)
3. Monitor usage via AWS CloudWatch
4. Set up billing alerts in AWS

## Monitoring Bedrock Usage

### AWS Console
1. Go to CloudWatch
2. Select "Bedrock" metrics
3. View:
   - Invocation count
   - Latency
   - Errors
   - Token usage

### Application Logs
The application logs every Bedrock call:

**Success**:
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "bedrock",
  "success": true,
  "profile": {
    "acres": 150,
    "experience": 5,
    "state": "SC"
  }
}
```

**Failure**:
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "bedrock",
  "success": false,
  "error": "Bedrock API timeout",
  "profile": {
    "acres": 150,
    "experience": 5,
    "state": "SC"
  }
}
```

## Troubleshooting

### Error: "Bedrock client not initialized"
**Cause**: Missing or invalid AWS credentials
**Solution**: 
1. Check `.env` file has correct credentials
2. Verify credentials in AWS Console
3. System will automatically use fallback mode

### Error: "Access denied"
**Cause**: IAM permissions insufficient
**Solution**:
1. Verify IAM policy includes `bedrock:InvokeModel`
2. Check resource ARN matches Claude 3 Haiku
3. Ensure model access is enabled in Bedrock console

### Error: "Model not found"
**Cause**: Model access not enabled or wrong region
**Solution**:
1. Enable Claude 3 Haiku in Bedrock console
2. Check `AWS_REGION` in `.env` matches enabled region
3. Wait a few minutes after enabling access

### Error: "Bedrock API timeout"
**Cause**: Request took longer than 30 seconds
**Solution**:
- This is normal occasionally
- System automatically falls back to rule-based scoring
- Consider increasing `BEDROCK_TIMEOUT` if frequent

### Error: "Rate limit exceeded"
**Cause**: Too many requests in short time
**Solution**:
1. Request rate limit increase in AWS Console
2. Implement request queuing (future enhancement)
3. System will fall back to rule-based scoring

## Bedrock vs Rule-Based Comparison

| Feature | Bedrock AI | Rule-Based |
|---------|-----------|------------|
| **Speed** | 2-5 seconds | < 100ms |
| **Cost** | ~$0.001/match | Free |
| **Accuracy** | High | Good |
| **Explanations** | Natural language | Template-based |
| **Nuance** | Excellent | Limited |
| **Reliability** | 95%+ | 100% |
| **Setup** | AWS account needed | None |
| **Maintenance** | Minimal | Update rules manually |

## Best Practices

### 1. Always Have Fallback
✅ Already implemented! System automatically falls back to rule-based scoring.

### 2. Set Reasonable Timeout
✅ 30 seconds configured - good balance between waiting and fallback.

### 3. Log All Calls
✅ Every Bedrock call is logged with success/failure status.

### 4. Monitor Costs
- Set up AWS billing alerts
- Review CloudWatch metrics weekly
- Track cost per user

### 5. Handle Errors Gracefully
✅ All errors caught and logged, user never sees Bedrock failures.

### 6. Secure Credentials
- Never commit `.env` to Git
- Use environment variables in production
- Rotate credentials periodically
- Use IAM roles when possible (EC2, ECS, Lambda)

## Testing Bedrock Integration

### Test 1: Verify Connection
```bash
npm start
```
Look for: `✅ AWS Bedrock client initialized successfully`

### Test 2: Compare Results
1. Register and login
2. View matches
3. Check for "🤖 AI-Powered Matching" badge
4. Compare match reasons with rule-based output

### Test 3: Test Fallback
1. Temporarily set invalid AWS credentials
2. Restart server
3. Verify matches still work
4. Check for "📊 Rule-Based Matching" badge

### Test 4: Monitor Logs
Watch console for:
```
🤖 Attempting AWS Bedrock AI matching...
✅ Using AWS Bedrock AI-powered matching
```

Or fallback:
```
⚠️  Bedrock unavailable, using rule-based fallback: [error]
✅ Using rule-based matching algorithm
```

## Security Considerations

### ✅ Implemented
- Credentials in environment variables
- Password excluded from Bedrock prompts
- Email excluded from Bedrock prompts
- Only farm profile data sent to Bedrock

### 🔒 Additional Recommendations
1. **Rotate Credentials**: Change AWS keys every 90 days
2. **Use IAM Roles**: When deploying to AWS services
3. **Enable CloudTrail**: Audit all Bedrock API calls
4. **Set Up Alerts**: Get notified of unusual activity
5. **Least Privilege**: Only grant necessary permissions

## FAQ

### Q: Is AWS Bedrock required?
**A**: No! The system works perfectly without it using rule-based scoring.

### Q: How much does Bedrock cost?
**A**: ~$0.001-0.002 per match. Very affordable for most use cases.

### Q: What happens if Bedrock fails?
**A**: Automatic fallback to rule-based scoring. Users never see errors.

### Q: Can I use a different AI model?
**A**: Yes, but requires code changes. Claude 3 Haiku is optimized for this use case.

### Q: How do I know if Bedrock is working?
**A**: Check server logs and look for "🤖 AI-Powered Matching" badge in UI.

### Q: Is my data sent to Anthropic?
**A**: Yes, farm profile and program data is sent to Claude via AWS Bedrock. No personal info (email, password) is sent.

### Q: Can I use Bedrock in development?
**A**: Yes, but consider using fallback mode to avoid costs during testing.

### Q: What if I exceed my budget?
**A**: Set up AWS billing alerts. System will continue working with fallback mode if you disable Bedrock.

## Support Resources

- **AWS Bedrock Documentation**: https://docs.aws.amazon.com/bedrock/
- **Claude 3 Haiku Info**: https://www.anthropic.com/claude
- **AWS Support**: Available in AWS Console
- **Pricing Calculator**: https://calculator.aws/

## Conclusion

AWS Bedrock integration is **optional but recommended** for the best user experience. The system is designed to work seamlessly with or without it, ensuring your application is always available to farmers seeking funding opportunities.

**Quick Decision Guide**:
- **Use Bedrock if**: You want best match quality and can afford ~$10/month for 5000 matches
- **Use Fallback if**: You're testing, want zero AI costs, or don't want AWS setup

Both options provide excellent results! 🌱
