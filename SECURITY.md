# 🔒 Security Configuration for GoAdventureGo

## ⚠️ SENSITIVE INFORMATION NOTICE

This repository contains **placeholder values** for sensitive configuration. 
**NEVER commit real credentials to GitHub!**

## 🔐 Required Environment Variables

### For Render (Backend):
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Strong secret for JWT tokens (min 32 characters)
- `STRIPE_SECRET_KEY` - Your Stripe secret key (optional)
- `RAZORPAY_KEY_SECRET` - Your Razorpay secret key (optional)

### For Netlify (Frontend):
- `VITE_API_URL` - Your Render backend URL

## ✅ Security Best Practices

1. **Environment Variables**: Set in hosting platform, not in code
2. **Strong Secrets**: Use long, random strings for JWT_SECRET
3. **CORS Configuration**: Restrict origins in production
4. **HTTPS Only**: All production URLs should use HTTPS
5. **Regular Updates**: Keep dependencies updated

## 🚨 What NOT to commit:
- `.env` files with real credentials
- Database connection strings with passwords
- API keys and secrets
- SSL certificates and private keys

## 📋 Deployment Checklist:
- [ ] Environment variables set in Render dashboard
- [ ] Environment variables set in Netlify dashboard  
- [ ] Strong JWT secret generated
- [ ] MongoDB IP whitelist configured
- [ ] CORS origins properly restricted
- [ ] Build and deployment successful
- [ ] Authentication endpoints tested

## 🔧 Generate Secure JWT Secret:
```bash
# Use one of these methods:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
openssl rand -hex 32
```

Remember: **Security is not optional!** 🛡️
