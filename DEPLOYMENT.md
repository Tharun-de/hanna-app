# 🚀 Vercel Deployment Guide

## 📋 **Pre-Deployment Checklist**

### ✅ **Current Status:**
- ✅ Clean project structure (`hanna-app/`)
- ✅ Frontend: React + TypeScript + Vite
- ✅ Backend: Express + Prisma + PostgreSQL
- ✅ Database: Supabase (production-ready)
- ✅ Environment variables: Configured locally

---

## 🌐 **Vercel Deployment Steps**

### **Step 1: Prepare Repository**
```bash
# Make sure you're in the root directory
cd /path/to/hanna

# Initialize git if not already done
git init
git add .
git commit -m "Initial deployment - clean hanna app structure"

# Push to GitHub (create repo first on github.com)
git remote add origin https://github.com/yourusername/hanna.git
git branch -M main
git push -u origin main
```

### **Step 2: Deploy to Vercel**

#### **Option A: Vercel CLI (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from root directory
cd hanna-app
vercel

# Follow prompts:
# ? Set up and deploy? [Y/n] Y
# ? Which scope? [your-username]
# ? What's your project's name? hanna-app
# ? In which directory is your code located? ./
```

#### **Option B: Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. **Root Directory**: `hanna-app`
5. **Framework Preset**: Other
6. Click "Deploy"

### **Step 3: Configure Environment Variables**

In Vercel Dashboard → Project → Settings → Environment Variables:

```env
# Add these variables:
DATABASE_URL=postgresql://postgres:Delta%402014@db.szahkpbxsdvhkspihefj.supabase.co:5432/postgres
NODE_ENV=production
PORT=3001
```

### **Step 4: Update Domain Settings**
Once deployed, update your backend CORS settings if needed:
```javascript
// In server.js, update CORS origin to your Vercel domain
origin: process.env.FRONTEND_URL || 'https://your-app.vercel.app'
```

---

## 📁 **Project Structure for Vercel**

```
hanna-app/
├── frontend/          # Static site (served by Vercel)
│   ├── dist/         # Built files (auto-generated)
│   ├── src/          # React source
│   └── package.json  # Build config
├── backend/          # Serverless functions
│   ├── server.js     # API endpoints
│   └── package.json  # Server dependencies
├── vercel.json       # Vercel configuration
└── README.md
```

---

## 🔧 **Vercel Configuration**

The `vercel.json` file handles:
- ✅ **Frontend**: Static React app
- ✅ **Backend**: Serverless Node.js functions
- ✅ **Routing**: API routes to backend, everything else to frontend
- ✅ **Environment**: Production settings

---

## 🎯 **Post-Deployment**

### **Verify Deployment:**
1. **Frontend**: https://your-app.vercel.app
2. **API Health**: https://your-app.vercel.app/api/health
3. **Database**: Test creating/editing writings

### **Update Local Development:**
```bash
# Update .env with production URL for testing
FRONTEND_URL=https://your-app.vercel.app
```

---

## 🐛 **Troubleshooting**

### **Common Issues:**
- **Build fails**: Check `package.json` scripts
- **API not working**: Verify environment variables in Vercel
- **Database connection**: Ensure Supabase URL is correct
- **CORS errors**: Update CORS origin in server.js

### **Useful Commands:**
```bash
# Local production build test
cd frontend && npm run build && npm run preview

# Check Vercel logs
vercel logs

# Redeploy
vercel --prod
```

---

## ✨ **Success!**

Your Hanna app will be live at: `https://your-app.vercel.app`

**Features Working:**
- ✅ Create and edit writings (original issue fixed!)
- ✅ Organize in sections
- ✅ Rich text editing
- ✅ Responsive design
- ✅ Database persistence 