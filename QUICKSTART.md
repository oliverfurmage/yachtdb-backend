# Quick Start Guide

## 🚀 Get Your YachtDB Running in Minutes

Follow these steps to get your yacht listing management system up and running.

## Step 1: Deploy the Backend (10-15 minutes)

### 1.1 Install Serverless Framework

```bash
npm install -g serverless
```

### 1.2 Configure AWS Credentials

```bash
aws configure
```

Enter your AWS Access Key ID, Secret Access Key, and preferred region (e.g., `us-east-1`).

### 1.3 Deploy Backend

```bash
cd backend
npm install
npm run deploy:dev
```

### 1.4 Save the Outputs

After deployment completes, you'll see outputs like this:

```
Outputs:
  HttpApiUrl: https://abc123xyz.execute-api.us-east-1.amazonaws.com
  UserPoolId: us-east-1_ABC123XYZ
  UserPoolClientId: 1a2b3c4d5e6f7g8h9i0j1k
```

**Copy these values** - you'll need them in the next step!

## Step 2: Configure the Frontend (5 minutes)

### 2.1 Create Environment File

```bash
cd admin
cp .env.local.example .env.local
```

### 2.2 Edit `.env.local`

Open `.env.local` and fill in the values from Step 1.4:

```env
NEXT_PUBLIC_USER_POOL_ID=us-east-1_ABC123XYZ
NEXT_PUBLIC_USER_POOL_CLIENT_ID=1a2b3c4d5e6f7g8h9i0j1k
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_API_URL=https://abc123xyz.execute-api.us-east-1.amazonaws.com
```

### 2.3 Install Dependencies and Run

```bash
npm install
npm run dev
```

## Step 3: Access Your Application (2 minutes)

1. **Open your browser** to `http://localhost:3000`

2. **Create an account:**
   - Click "Create Account"
   - Enter your email and password
   - Verify your email if prompted

3. **Sign in** with your credentials

## Step 4: Set Up Your Yacht Fields (3 minutes)

1. **Navigate to Settings** (gear icon in sidebar)

2. **Add fields** for your yachts. For example:
   - **Length** (Number, Required)
   - **Year Built** (Number, Required)
   - **Manufacturer** (Text, Required)
   - **Condition** (Select: New, Used, Excellent, Good, Fair)
   - **Price** (Number, Required)
   - **Description** (Textarea, Optional)

3. **Click "Save Configuration"**

## Step 5: Add Your First Yacht (2 minutes)

1. **Go to Yachts** page (ship icon in sidebar)

2. **Click "Add Yacht"**

3. **Fill in the form:**
   - Yacht name
   - All the custom fields you configured

4. **Click "Save Yacht"**

🎉 **Congratulations!** Your YachtDB is now running!

## What's Next?

### For Development:
- Modify field configurations as needed
- Add more yachts
- Customize the UI in `admin/src/components/`

### For Production:

1. **Deploy frontend** to Vercel:
   ```bash
   cd admin
   npm install -g vercel
   vercel
   ```

2. **Deploy backend to production:**
   ```bash
   cd backend
   npm run deploy:prod
   ```

3. **Update frontend environment** with production API URL

## Common Issues

### Issue: Can't connect to API

**Check:**
- Is the API URL correct in `.env.local`?
- Did you include `https://` in the URL?
- Is the backend deployed successfully?

**Test the API:**
```bash
curl https://your-api-url.execute-api.us-east-1.amazonaws.com/yachts
```

### Issue: Authentication fails

**Check:**
- Are User Pool ID and Client ID correct?
- Is the region correct?
- Try logging out and back in

### Issue: Fields not saving

**Check:**
- Are you signed in?
- Check browser console for errors
- Verify API URL is correct

## Getting Help

- Check `README.md` for detailed documentation
- Review `backend/DEPLOYMENT.md` for backend deployment issues
- Review `admin/DEPLOYMENT.md` for frontend deployment issues

## Useful Commands

```bash
# Backend
cd backend
npm run deploy:dev         # Deploy to dev
npm run deploy:prod        # Deploy to production
serverless logs -f listYachts --tail  # View logs

# Frontend
cd admin
npm run dev               # Development server
npm run build             # Build for production
npm start                 # Run production build
```

## Architecture Overview

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ HTTPS
       ▼
┌─────────────────┐
│   Next.js App   │
│   (Frontend)    │
└────────┬────────┘
         │
         │ REST API + JWT
         ▼
┌────────────────────────┐
│   API Gateway          │
│   (AWS)                │
└───────┬────────────────┘
        │
        │ Invokes
        ▼
┌────────────────────────┐
│   Lambda Functions     │
│   (Backend Logic)      │
└───────┬────────────────┘
        │
        │ Reads/Writes
        ▼
┌────────────────────────┐     ┌──────────────┐
│   DynamoDB             │     │   Cognito    │
│   (Database)           │     │   (Auth)     │
└────────────────────────┘     └──────────────┘
```

## Cost Estimate

For typical usage (< 1000 requests/day):
- **AWS Lambda**: Free tier (1M requests/month)
- **API Gateway**: Free tier first 12 months
- **DynamoDB**: ~$1-5/month (on-demand)
- **Cognito**: Free (< 50k MAU)
- **Total**: ~$1-5/month

## Next Steps

Now that your app is running:

1. **Customize the UI** - Edit components in `admin/src/components/`
2. **Add more features** - Extend the API in `backend/src/handlers/`
3. **Deploy to production** - Follow deployment guides
4. **Add a custom domain** - Configure DNS for your domain
5. **Set up monitoring** - Use CloudWatch for backend, Vercel Analytics for frontend

Happy yacht listing! ⛵
