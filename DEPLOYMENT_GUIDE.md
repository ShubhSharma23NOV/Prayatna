# Netlify Deployment Guide

## Prerequisites
- GitHub account
- Netlify account (free tier works)
- Git installed locally

## Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - Ready for deployment"
```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Create a new repository (e.g., "civil-engineering-platform")
   - Don't initialize with README (you already have files)

3. **Push to GitHub**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Netlify

### Option A: Netlify UI (Recommended)

1. **Go to Netlify**: https://app.netlify.com
2. **Click "Add new site" → "Import an existing project"**
3. **Connect to GitHub**: Authorize Netlify to access your repos
4. **Select your repository**
5. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18`
6. **Click "Deploy site"**

### Option B: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

## Step 3: Post-Deployment

Your site will be live at: `https://YOUR_SITE_NAME.netlify.app`

### Custom Domain (Optional)
1. Go to Site settings → Domain management
2. Add custom domain
3. Follow DNS configuration instructions

## Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Ensure all dependencies are in package.json
- Try building locally: `npm run build`

### 404 Errors
- Verify `netlify.toml` is in root directory
- Check redirects configuration

### Performance Issues
- Enable Netlify CDN
- Check asset optimization settings

## Environment Variables (if needed)
1. Go to Site settings → Environment variables
2. Add any required variables
3. Redeploy

## Continuous Deployment
Every push to `main` branch will automatically trigger a new deployment!
