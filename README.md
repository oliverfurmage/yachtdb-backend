# YachtDB Backend

Serverless REST API for yacht listing management built with Serverless Framework 4 and AWS.

## 🎯 Features

- **Serverless Architecture** - AWS Lambda + API Gateway
- **Authentication** - AWS Cognito JWT authorization
- **Database** - DynamoDB for yachts and field configurations
- **Infrastructure as Code** - Serverless Framework
- **Multi-tenant** - User-isolated data

## 🏗️ Architecture

```
┌─────────────────┐
│   API Gateway   │  (HTTP API with JWT authorizer)
└────────┬────────┘
         │
         ├─── GET    /field-config
         ├─── PUT    /field-config
         ├─── GET    /yachts
         ├─── GET    /yachts/{id}
         ├─── POST   /yachts
         ├─── PUT    /yachts/{id}
         └─── DELETE /yachts/{id}
         │
         ▼
┌─────────────────┐
│  Lambda Functions│
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────┐
│   DynamoDB      │     │   Cognito    │
│   - Yachts      │     │   User Pool  │
│   - FieldConfig │     └──────────────┘
└─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- AWS Account with appropriate permissions
- AWS CLI configured
- Serverless Framework 4: `npm install -g serverless`

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure AWS credentials:**
   ```bash
   aws configure
   ```

3. **Deploy to AWS:**
   ```bash
   # Deploy to development
   npm run deploy:dev

   # Deploy to production
   npm run deploy:prod
   ```

4. **Save deployment outputs:**
   After deployment, save these values:
   - `HttpApiUrl` - API Gateway endpoint
   - `UserPoolId` - Cognito User Pool ID
   - `UserPoolClientId` - Cognito Client ID

## 📁 Project Structure

```
backend/
├── src/
│   └── handlers/
│       ├── fieldConfig.js    # Field configuration handlers
│       └── yachts.js         # Yacht CRUD handlers
├── serverless.yml            # Serverless configuration
├── package.json
├── .env.example
├── .gitignore
├── README.md                 # This file
├── DEPLOYMENT.md            # Detailed deployment guide
├── QUICKSTART.md            # Quick start guide
└── API.md                   # API documentation
```

## 📡 API Endpoints

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

### Field Configuration
- `GET /field-config` - Get user's field configuration
- `PUT /field-config` - Update field configuration

### Yachts
- `GET /yachts` - List all user's yachts
- `GET /yachts/{id}` - Get specific yacht
- `POST /yachts` - Create new yacht
- `PUT /yachts/{id}` - Update yacht
- `DELETE /yachts/{id}` - Delete yacht

See [API.md](./API.md) for detailed API documentation.

## 🗄️ Database Schema

### Yachts Table
- **Partition Key:** `userId` (String)
- **Sort Key:** `id` (String)
- **Attributes:** `name`, `data` (object), `createdAt`, `updatedAt`

### Field Config Table
- **Partition Key:** `userId` (String)
- **Attributes:** `fields` (array), `updatedAt`

## 🛠️ Development

### Local Development

```bash
# Install serverless-offline
npm install --save-dev serverless-offline

# Run locally
serverless offline start
```

### Testing Functions

```bash
# Invoke function directly
serverless invoke -f listYachts --stage dev

# View logs
serverless logs -f listYachts --stage dev --tail
```

### Environment Variables

Functions have access to:
- `YACHTS_TABLE` - DynamoDB yachts table name
- `FIELD_CONFIG_TABLE` - DynamoDB field config table name
- `USER_POOL_ID` - Cognito User Pool ID (auto-referenced)

## 🚀 Deployment

### Deploy to Development

```bash
npm run deploy:dev
```

### Deploy to Production

```bash
npm run deploy:prod
```

### Deploy Single Function

```bash
serverless deploy function -f listYachts --stage dev
```

### Remove Deployment

```bash
serverless remove --stage dev
```

⚠️ **Warning:** This deletes all resources including data in DynamoDB!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🔧 Configuration

### Serverless.yml

Key configuration options:

```yaml
provider:
  name: aws
  runtime: nodejs20.x
  region: us-east-1        # Change AWS region
  stage: dev               # Deployment stage
  memorySize: 256          # Lambda memory
  timeout: 30              # Lambda timeout
```

### AWS Resources

The deployment creates:
- **Lambda Functions** (7 functions)
- **API Gateway** (HTTP API)
- **DynamoDB Tables** (2 tables)
- **Cognito User Pool** + Client
- **IAM Roles** and policies
- **CloudWatch Log Groups**

## 🔐 Security

- **Authentication:** JWT tokens from Cognito
- **Authorization:** User ID from JWT claims
- **Data Isolation:** All queries filtered by `userId`
- **IAM:** Least-privilege roles for Lambda functions
- **Encryption:** DynamoDB encryption at rest (default)

## 💰 Cost Estimation

Based on AWS pricing (us-east-1):

### Free Tier Eligible
- Lambda: 1M requests/month free
- API Gateway: 1M requests/month free (12 months)
- DynamoDB: 25 GB storage free

### Pay-per-use
- Lambda: $0.20 per 1M requests
- DynamoDB: ~$1.25 per million writes
- API Gateway: $1.00 per million requests

**Estimated monthly cost:** $5-20 for moderate usage

## 📊 Monitoring

### CloudWatch Metrics
- Lambda invocations, errors, duration
- API Gateway requests, latency, errors
- DynamoDB read/write capacity

### View Metrics

```bash
# Function metrics
serverless metrics --stage dev

# CloudWatch dashboard
aws cloudwatch get-dashboard --dashboard-name YachtDB
```

## 🐛 Troubleshooting

### Deployment Fails
- Check AWS credentials: `aws sts get-caller-identity`
- Verify IAM permissions
- Check CloudFormation stack in AWS Console

### Function Timeouts
- Increase timeout in `serverless.yml`
- Check DynamoDB capacity
- Review CloudWatch logs

### CORS Errors
- CORS is configured for `*` origin
- For production, update headers in handlers to specific domain

### DynamoDB Errors
- Check table names in environment variables
- Verify IAM role permissions
- Check for throttling in CloudWatch

## 📝 Scripts

```bash
npm run deploy:dev      # Deploy to development
npm run deploy:prod     # Deploy to production
npm run remove          # Remove deployment
npm run logs            # View function logs
npm run invoke          # Invoke function
```

## 🔄 CI/CD

For automated deployments, add to your CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Deploy to AWS
  run: |
    npm install
    serverless deploy --stage prod
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## 📚 Additional Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Comprehensive deployment guide
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide
- [API.md](./API.md) - Complete API documentation

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

## 📧 Support

For issues or questions:
- Check the documentation files
- Review CloudWatch logs
- Open a GitHub issue
