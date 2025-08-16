# Step-by-Step URL Connection Guide

## After you get your Netlify URL, follow these steps:

### Update Render Backend Environment Variables

1. Go to your Render Dashboard: https://dashboard.render.com
2. Click on your backend service (goadventurego-api or similar)
3. Click "Environment" tab
4. Add/Update these variables:

```
CLIENT_URL = https://your-netlify-url.netlify.app
CORS_ORIGIN = https://your-netlify-url.netlify.app
```

### Update Frontend Environment (if needed)

If your Netlify site is not connecting to backend:

1. Go to Netlify Dashboard
2. Click your site → Site settings → Environment variables  
3. Update:

```
VITE_API_URL = https://goadventurego.onrender.com/api
```

## Test Connection

1. Visit your Netlify URL
2. Try signin/signup forms
3. Check browser console for any CORS errors
4. If errors, double-check environment variables match exactly

## Troubleshooting URLs

### Common Issues:
- **CORS errors**: Check CORS_ORIGIN matches your Netlify URL exactly
- **API not found**: Check VITE_API_URL points to your Render backend
- **Build fails**: Check environment variables are set before deployment

### Your URLs should be:
- **Backend**: https://goadventurego.onrender.com/api
- **Frontend**: https://your-site-name.netlify.app
