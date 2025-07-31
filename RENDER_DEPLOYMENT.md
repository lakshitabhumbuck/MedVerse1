# Render Deployment Guide

## Prerequisites
1. MongoDB Atlas account (free tier available)
2. Xendit account for payment processing
3. Cloudinary account for image uploads

## Environment Variables Setup

### 1. MongoDB Configuration
- **For Render**: Use MongoDB Atlas connection string
- **Format**: `mongodb+srv://username:password@cluster.mongodb.net/prescripto`
- **Note**: The database name `prescripto` is automatically appended if not present

### 2. Xendit Configuration
- **API Key**: Must start with `xnd_`
- **Get from**: https://dashboard.xendit.co/settings/developers#api-keys
- **Example**: `xnd_public_development_...` or `xnd_production_...`

### 3. Required Environment Variables for Render

```env
# MongoDB (Required)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prescripto

# JWT (Required)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Cloudinary (Required for image uploads)
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

# Xendit (Required for payments)
XENDIT_API_KEY=xnd_public_development_... # Must start with xnd_
XENDIT_CALLBACK_TOKEN=your_xendit_callback_token
XENDIT_WEBHOOK_URL=https://your-render-app.onrender.com/api/user/xendit-webhook

# Frontend URL (Update with your frontend URL)
FRONTEND_URL=https://your-render-app.onrender.com

# Admin Configuration
ADMIN_EMAIL=admin@prescripto.com
ADMIN_PASSWORD=admin_password_here

# Server Configuration
PORT=10000
NODE_ENV=production
```

## Render Deployment Steps

### Option 1: Single Service (Recommended)
**Deploy both frontend and backend from one service:**

1. **Create Web Service**
   - Connect your GitHub repository to Render
   - Create a new **Web Service**

2. **Configure Build Settings**
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node
   - **Region**: Choose closest to your users

3. **Environment Variables**
   - Add all environment variables listed above
   - **Important**: Set `NODE_ENV=production`

### Option 2: Separate Services
**Deploy frontend and backend as separate services:**

#### Backend Service:
1. **Build Command**: `cd backend && npm install`
2. **Start Command**: `cd backend && npm start`

#### Frontend Service:
1. **Build Command**: `cd frontend && npm install && npm run build`
2. **Start Command**: `cd frontend && npm run preview`
3. **Environment Variables**:
   ```env
   VITE_API_URL=https://your-backend-app.onrender.com
   ```

## Common Issues and Solutions

### 1. "Invalid secret key provided" Error
- **Cause**: Xendit API key doesn't start with `xnd_`
- **Solution**: Get correct API key from Xendit dashboard

### 2. "Invalid scheme" MongoDB Error
- **Cause**: Incorrect MongoDB connection string format
- **Solution**: Use MongoDB Atlas connection string starting with `mongodb+srv://`

### 3. "MONGODB_URI environment variable is not set"
- **Cause**: Environment variable not configured in Render
- **Solution**: Add MONGODB_URI to Render environment variables

### 4. Frontend not showing (only API working)
- **Cause**: Frontend not deployed or not configured properly
- **Solution**: Use Option 1 (single service) or deploy separate frontend service

### 5. Database Connection Issues
- **Check**: MongoDB Atlas network access (allow all IPs: 0.0.0.0/0)
- **Check**: Database user credentials
- **Check**: Connection string format

### 6. Payment Processing Issues
- **Check**: Xendit account is properly configured
- **Check**: Webhook URL is accessible
- **Check**: API key has correct permissions

## Testing Deployment

1. **Health Check**: Visit your backend URL to see "API WORKING..." message
2. **Database**: Check logs for "Database Connected!" message
3. **Frontend**: Should show your React app (not just API message)
4. **API Test**: Test a simple endpoint like `/api/health`

## Security Notes

- Use strong JWT secrets
- Keep API keys secure
- Use HTTPS in production
- Regularly rotate API keys
- Monitor application logs

## Support

If you encounter issues:
1. Check Render service logs
2. Verify all environment variables are set
3. Ensure MongoDB Atlas is accessible
4. Confirm Xendit API key format
5. Make sure NODE_ENV=production is set for single service deployment 
