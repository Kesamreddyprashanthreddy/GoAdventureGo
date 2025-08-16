# 🚀 Deployment Guide: Backend (Render) + Frontend (Netlify)

## 📋 Overview
- **Backend API:** Render Web Service
- **Frontend:** Netlify Static Site
- **Advantages:** Better performance, easier configuration, separate scaling

---

## 🔧 BACKEND DEPLOYMENT (Render)

### Step 1: Create Render Web Service
1. **Go to Render Dashboard:** https://dashboard.render.com
2. **New → Web Service**
3. **Connect GitHub:** `Kesamreddyprashanthreddy/GoAdventureGo`

### Step 2: Configure Render Service
**Basic Settings:**
- **Name:** `goadventurego-api`
- **Runtime:** `Node`
- **Root Directory:** `server` ⚠️ IMPORTANT!
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### Step 3: Environment Variables (Render)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://prashanth503510:2203031240601@cluster0.xogden4.mongodb.net/goadventurego
JWT_SECRET=GoAdventureGo2025SuperSecretKeyForProductionOnlyChangeInProduction1234567890
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
CORS_ORIGIN=*
CLIENT_URL=https://your-netlify-url.netlify.app
```

### Step 4: Get Backend URL
After deployment: `https://goadventurego-api.onrender.com`

---

## 🌐 FRONTEND DEPLOYMENT (Netlify)

### Step 1: Create Netlify Site
1. **Go to Netlify:** https://app.netlify.com
2. **New site from Git**
3. **Connect GitHub:** `Kesamreddyprashanthreddy/GoAdventureGo`

### Step 2: Configure Netlify Build Settings
**Build Settings:**
- **Base Directory:** (leave empty - root directory)
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`

### Step 3: Environment Variables (Netlify)
Go to **Site Settings → Environment Variables:**
```
VITE_API_URL=https://goadventurego-api.onrender.com/api
NODE_ENV=production
```

### Step 4: Advanced Settings (Optional)
Create `netlify.toml` in root directory:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  VITE_API_URL = "https://goadventurego-api.onrender.com/api"
```

---

## ✅ VERIFICATION STEPS

### Test Backend (Render)
```bash
curl https://goadventurego-api.onrender.com/api/health
# Should return: {"success":true,"message":"Server is healthy"}
```

### Test Frontend (Netlify)
1. Visit your Netlify URL
2. Check browser console - no CORS errors
3. Try signin/signup forms
4. Check Network tab - API calls go to Render backend

---

## 🔄 UPDATE EXISTING CONFIGURATION

### Update Frontend API Configuration
Update your `.env.production` file:
```env
VITE_API_URL=https://goadventurego-api.onrender.com/api
NODE_ENV=production
```

### Update Backend CORS
Make sure your backend allows Netlify domain:
```javascript
// In server/server.js
const allowedOrigins = [
  'https://your-netlify-url.netlify.app',
  'https://your-custom-domain.com',
  'http://localhost:5173'
]
```

---

## 🎯 ADVANTAGES OF THIS SETUP

✅ **Better Performance:** Netlify CDN for frontend  
✅ **Easier Configuration:** No complex routing issues  
✅ **Independent Scaling:** Scale backend and frontend separately  
✅ **Cost Effective:** Netlify free tier is generous  
✅ **Faster Builds:** Netlify builds are typically faster  
✅ **Better Caching:** Automatic asset optimization  

---

## 🚨 TROUBLESHOOTING

### CORS Issues
- Add your Netlify URL to backend `CORS_ORIGIN`
- Check browser Network tab for blocked requests

### API Connection Issues  
- Verify `VITE_API_URL` points to correct Render URL
- Ensure Render service is running (check logs)

### Build Failures
- **Netlify:** Check build logs, ensure all dependencies in package.json
- **Render:** Check server logs, verify environment variables set

**Ready to deploy? Let me know which step you need help with first!** 🚀
