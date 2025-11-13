# Backend Deployment Guide

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **Node.js** 18+ and npm
4. **Serverless Framework** 4 installed globally

## Step-by-Step Deployment

### 1. Configure AWS Credentials

```bash
# Configure AWS CLI
aws configure

# Enter your:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region (e.g., us-east-1)
# - Default output format (json)
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Deploy to Development

```bash
npm run deploy:dev
```

This will:
- Create Lambda functions
- Set up API Gateway
- Create DynamoDB tables
- Create Cognito User Pool
- Configure IAM roles

### 4. Save Deployment Outputs

After successful deployment, you'll see outputs like:

```
Outputs:
  HttpApiUrl: https://abc123.execute-api.us-east-1.amazonaws.com
  UserPoolId: us-east-1_ABC123
  UserPoolClientId: 1a2b3c4d5e6f7g8h9i0j
```

**Save these values** - you'll need them for frontend configuration.

### 5. Test the API

```bash
# Get the API URL from outputs
export API_URL=https://your-api-url.execute-api.us-east-1.amazonaws.com

# Test health (this endpoint doesn't require auth)
curl $API_URL
```

### 6. Deploy to Production

When ready for production:

```bash
npm run deploy:prod
```

## Deployment Stages

- **dev** - Development environment
- **prod** - Production environment

Each stage creates separate AWS resources to keep environments isolated.

## Updating the Backend

After making code changes:

```bash
# Deploy changes
npm run deploy:dev

# Or just deploy a specific function
serverless deploy function -f listYachts --stage dev
```

## Viewing Logs

```bash
# View logs for a specific function
serverless logs -f listYachts --stage dev

# Tail logs in real-time
serverless logs -f listYachts --stage dev --tail
```

## Invoking Functions Directly

```bash
# Invoke a function
serverless invoke -f listYachts --stage dev
```

## Removing Deployment

To completely remove all AWS resources:

```bash
serverless remove --stage dev
```

⚠️ **Warning**: This will delete all data in DynamoDB tables!

## Troubleshooting

### Issue: Deployment fails with IAM permissions error

**Solution**: Ensure your AWS user has the following policies:
- AWSLambdaFullAccess
- AmazonDynamoDBFullAccess
- AmazonAPIGatewayAdministrator
- AmazonCognitoPowerUser
- IAMFullAccess
- CloudFormationFullAccess

### Issue: Function timeout

**Solution**: Increase timeout in `serverless.yml`:
```yaml
provider:
  timeout: 30  # Increase this value
```

### Issue: DynamoDB throughput errors

**Solution**: Change billing mode or increase capacity:
```yaml
BillingMode: PAY_PER_REQUEST  # or PROVISIONED
```

## Environment Variables

To set environment variables for Lambda functions:

```yaml
provider:
  environment:
    MY_VARIABLE: my-value
```

Or use `.env` file with serverless-dotenv-plugin.

## Custom Domain

To use a custom domain:

1. Purchase/configure domain in Route 53
2. Create ACM certificate
3. Add custom domain configuration to `serverless.yml`

## Monitoring

Use AWS CloudWatch to monitor:
- Lambda function metrics (invocations, errors, duration)
- API Gateway metrics (requests, latency, 4xx/5xx errors)
- DynamoDB metrics (read/write capacity, throttles)

Access CloudWatch:
```bash
# View in AWS Console
aws cloudwatch get-metric-statistics ...

# Or use serverless plugin
serverless metrics --stage dev
```

## Cost Optimization

1. **Use provisioned concurrency only if needed** (additional cost)
2. **Set appropriate memory size** (balance performance vs cost)
3. **Use DynamoDB on-demand pricing** for unpredictable traffic
4. **Enable CloudWatch Logs retention policy** to avoid accumulating logs

## Security Best Practices

1. **Rotate AWS credentials regularly**
2. **Use IAM roles with least privilege**
3. **Enable CloudTrail for audit logging**
4. **Enable DynamoDB encryption at rest**
5. **Use AWS Secrets Manager** for sensitive data

## Backup Strategy

DynamoDB Point-in-Time Recovery:
```bash
aws dynamodb update-continuous-backups \
  --table-name yachtdb-backend-yachts-dev \
  --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true
```
