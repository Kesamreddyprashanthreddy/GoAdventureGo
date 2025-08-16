# Render Deployment Guide for GoAdventureGo

## 🚨 IMPORTANT: Your Current Issue

Your website shows "Server error" because your current Render service is misconfigured. You need to create **TWO separate services**:

1. **Backend API** (Web Service) - for your Node.js server
2. **Frontend** (Static Site) - for your React app

## 🔧 Step-by-Step Fix

### Method 1: Using Render Blueprint (Recommended)

1. **Delete your current service** on Render dashboard
2. **Create New → Blueprint**
3. **Connect Repository:** `Kesamreddyprashanthreddy/GoAdventureGo`
4. **Render will automatically create both services** using the `render.yaml` file

### Method 2: Manual Setup

#### Step 1: Create Backend Service

1. **New → Web Service**
2. **Settings:**
   - Name: `goadventurego-api`
   - Runtime: `Node`
   - Root Directory: `server` ⚠️ CRITICAL!
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables:**
```
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
CORS_ORIGIN=*
CLIENT_URL=https://goadventurego.onrender.com
```

#### Step 2: Create Frontend Service

1. **New → Static Site**
2. **Settings:**
   - Name: `goadventurego-frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

3. **Environment Variables:**
```
VITE_API_URL=https://goadventurego-api.onrender.com/api
```

## 🎯 Expected URLs After Fix

- **Backend API:** `https://goadventurego-api.onrender.com/api`
- **Frontend:** `https://goadventurego-frontend.onrender.com`

## ✅ Verification Steps

1. **Test Backend:** Visit `https://goadventurego-api.onrender.com/api/health`
   - Should return: `{"success":true,"message":"Server is healthy"}`

2. **Test Frontend:** Visit your frontend URL
   - Signin/Signup should work without "Server error"

## 🚨 Common Deployment Issues & Fixes

### Issue: Build Fails
- **Root Directory:** Must be `server` for backend
- **Dependencies:** Check `server/package.json` exists

### Issue: Service Won't Start
- **Environment Variables:** All required vars must be set
- **MongoDB:** Check connection string is valid
- **Port:** Don't set PORT manually (Render sets it automatically)

### Issue: 508 Loop Detected
- **Wrong Service Type:** Backend must be Web Service, not Static Site
- **Missing Environment:** NODE_ENV must be set to production

### Issue: CORS Errors
- **Backend CORS:** Set CORS_ORIGIN=* for testing
- **Frontend API URL:** Must point to correct backend service

## 🔍 Debugging

### Check Logs
1. Go to Render Dashboard
2. Select your service
3. Click "Logs" tab
4. Look for error messages

### Common Error Messages
- `MONGODB_URI is not set` → Add environment variable
- `Cannot find module` → Wrong root directory
- `Port in use` → Render port configuration issue
- `Bad Gateway` → Service not responding (check logs)
