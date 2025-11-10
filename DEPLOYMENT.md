# 🚀 CEMS Deployment Guide - Vercel

Complete guide to deploy CEMS on Vercel (Frontend + Backend)

---

## 📋 Prerequisites

1. ✅ GitHub account
2. ✅ Vercel account (sign up at vercel.com)
3. ✅ MongoDB Atlas account (free tier)
4. ✅ Gmail App Password
5. ✅ Razorpay account (test mode)

---

## 🔧 Step 1: Prepare MongoDB Atlas

1. Go to https://cloud.mongodb.com/
2. Create a free cluster
3. Database Access → Add Database User
4. Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
5. Connect → Get connection string
6. Replace `<password>` with your password
7. Save this connection string

---

## 🎯 Step 2: Deploy Backend on Vercel

### Option A: Using Vercel Dashboard (Easiest)

1. **Go to:** https://vercel.com/new
2. **Import Git Repository:**
   - Select: `thenamerahulkr/cems`
   - Click: Import

3. **Configure Project:**
   - Project Name: `cems-backend`
   - Framework Preset: Other
   - Root Directory: `server`
   - Build Command: `npm install`
   - Output Directory: (leave empty)
   - Install Command: `npm install`

4. **Environment Variables:**
   Click "Environment Variables" and add:

   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/CEMS?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_minimum_32_characters_long_random_string
   ADMIN_EMAIL=admin@college.edu
   ADMIN_PASSWORD=YourSecurePassword123!
   ADMIN_NAME=System Administrator
   MAIL_USER=your_email@gmail.com
   MAIL_PASS=your_gmail_app_password_16_chars
   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   CLIENT_URL=https://cems-frontend.vercel.app
   PORT=5000
   NODE_ENV=production
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Copy your backend URL (e.g., `https://cems-backend.vercel.app`)

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to server folder
cd server

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables
vercel env add MONGO_URI
vercel env add JWT_SECRET
vercel env add ADMIN_EMAIL
vercel env add ADMIN_PASSWORD
vercel env add ADMIN_NAME
vercel env add MAIL_USER
vercel env add MAIL_PASS
vercel env add RAZORPAY_KEY_ID
vercel env add RAZORPAY_KEY_SECRET
vercel env add CLIENT_URL

# Deploy to production
vercel --prod
```

---

## 🎨 Step 3: Deploy Frontend on Vercel

### Option A: Using Vercel Dashboard

1. **Go to:** https://vercel.com/new
2. **Import Git Repository:**
   - Select: `thenamerahulkr/cems` (same repo)
   - Click: Import

3. **Configure Project:**
   - Project Name: `cems-frontend`
   - Framework Preset: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Environment Variables:**
   ```
   VITE_API_URL=https://cems-backend.vercel.app/api
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🎉

### Option B: Using Vercel CLI

```bash
# Navigate to client folder
cd client

# Deploy
vercel

# Add environment variable
vercel env add VITE_API_URL

# Deploy to production
vercel --prod
```

---

## ✅ Step 4: Verify Deployment

### Backend Check:
1. Open: `https://cems-backend.vercel.app/health`
2. Should see: `{"status":"OK","message":"Server is running"}`

### Admin Check:
1. Check Vercel logs for backend
2. Should see: `✅ Admin user created successfully!`

### Frontend Check:
1. Open: `https://cems-frontend.vercel.app`
2. Should see landing page
3. Try login with admin credentials

---

## 🔐 Step 5: Update CORS Settings

If you get CORS errors:

1. Go to Vercel Dashboard → Backend Project
2. Settings → Environment Variables
3. Update `CLIENT_URL` to your frontend URL
4. Redeploy backend

---

## 🎯 Step 6: Custom Domain (Optional)

### For Frontend:
1. Vercel Dashboard → Frontend Project
2. Settings → Domains
3. Add your domain (e.g., `cems.yourcollege.edu`)
4. Follow DNS instructions

### For Backend:
1. Vercel Dashboard → Backend Project
2. Settings → Domains
3. Add subdomain (e.g., `api.cems.yourcollege.edu`)

---

## 📝 Environment Variables Reference

### Backend (.env):
```env
# Database
MONGO_URI=mongodb+srv://...

# JWT
JWT_SECRET=minimum_32_characters_random_string

# Admin (Auto-created on first deploy)
ADMIN_EMAIL=admin@college.edu
ADMIN_PASSWORD=SecurePassword123!
ADMIN_NAME=System Administrator

# Email
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

# Payment
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...

# CORS
CLIENT_URL=https://your-frontend.vercel.app

# Server
PORT=5000
NODE_ENV=production
```

### Frontend (.env):
```env
VITE_API_URL=https://your-backend.vercel.app/api
```

---

## 🐛 Troubleshooting

### Issue: Backend not responding
**Solution:** Check Vercel logs for errors

### Issue: Admin not created
**Solution:** Check environment variables are set correctly

### Issue: CORS errors
**Solution:** Update CLIENT_URL in backend environment variables

### Issue: Database connection failed
**Solution:** 
- Check MongoDB Atlas IP whitelist (0.0.0.0/0)
- Verify MONGO_URI is correct
- Check database user permissions

### Issue: Email not sending
**Solution:**
- Verify Gmail App Password (16 chars, no spaces)
- Check MAIL_USER and MAIL_PASS

---

## 🔄 Auto-Deploy Setup

Both frontend and backend will auto-deploy on every git push to main branch!

```bash
# Make changes
git add .
git commit -m "your message"
git push origin main

# Vercel automatically deploys! 🚀
```

---

## 📊 Monitoring

### View Logs:
1. Vercel Dashboard → Project
2. Deployments → Click latest deployment
3. View Function Logs

### Check Performance:
1. Vercel Dashboard → Project
2. Analytics tab
3. View metrics

---

## 🎉 Success!

Your CEMS is now live on:
- **Frontend:** https://cems-frontend.vercel.app
- **Backend:** https://cems-backend.vercel.app/api

**Admin Login:**
- Email: admin@college.edu (or your ADMIN_EMAIL)
- Password: Your ADMIN_PASSWORD

---

## 💡 Tips

1. ✅ Use strong passwords in production
2. ✅ Enable 2FA on Vercel account
3. ✅ Monitor usage in Vercel dashboard
4. ✅ Set up custom domain for professional look
5. ✅ Check logs regularly for errors
6. ✅ Keep environment variables secure

---

## 📞 Support

If you face any issues:
1. Check Vercel logs
2. Verify environment variables
3. Check MongoDB connection
4. Review CORS settings

---

**Happy Deploying! 🚀**
