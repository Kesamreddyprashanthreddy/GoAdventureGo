# Render Deployment Guide for GoAdventureGo Backend

## Step 1: Create New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `Kesamreddyprashanthreddy/GoAdventureGo`

## Step 2: Configure Service Settings

**Basic Settings:**
- **Name:** `goadventurego-backend`
- **Runtime:** `Node`
- **Branch:** `main`
- **Root Directory:** `server` (IMPORTANT!)
- **Build Command:** `npm install`
- **Start Command:** `npm start`

## Step 3: Set Environment Variables

Go to **Environment** tab and add these variables:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://prashanth503510:2203031240601@cluster0.xogden4.mongodb.net/goadventurego
JWT_SECRET=GoAdventureGo2025SuperSecretKeyForProductionOnlyChangeInProduction1234567890
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
CLIENT_URL=https://your-frontend-domain.com
CORS_ORIGIN=*
PRODUCTION_DOMAIN=https://your-frontend-domain.com
```

## Step 4: Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Your backend will be available at: `https://your-service-name.onrender.com`

## Step 5: Test Your Backend

Visit these URLs to verify:
- Health check: `https://your-service-name.onrender.com/api/health`
- Root endpoint: `https://your-service-name.onrender.com/`

## Common Issues & Fixes

### Build Fails
- **Root Directory:** Make sure it's set to `server`
- **Dependencies:** Ensure all dependencies are in `server/package.json`

### Service Won't Start
- **Environment Variables:** Check all required vars are set
- **Port:** Render automatically sets `PORT`, don't override it
- **MongoDB Connection:** Verify your connection string is correct

### CORS Errors
- Set `CORS_ORIGIN=*` for testing
- Add your frontend domain to `CLIENT_URL`

## Health Check
Your service should respond to: `/api/health` with status 200
