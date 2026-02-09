# Pre-Deployment Checklist ✅

## Before Deploying

- [ ] All code changes committed
- [ ] Build runs successfully locally (`npm run build`)
- [ ] No console errors in production build
- [ ] All dependencies in package.json
- [ ] .gitignore excludes build artifacts
- [ ] netlify.toml configured
- [ ] Environment variables documented (if any)

## Test Locally

```bash
# Clean and build
npm run clean
npm run build

# Test production build
npm start
```

Visit http://localhost:3000 and test:
- [ ] Login page works
- [ ] Dashboard loads
- [ ] IFC Viewer displays buildings
- [ ] Analysis page shows 3D model
- [ ] Student/Engineer role switching works
- [ ] 3D rotation and zoom work
- [ ] No 404 errors

## Deploy

```bash
# Option 1: Automated script
./deploy.sh

# Option 2: Manual
git add .
git commit -m "Production ready"
git push origin main
```

## Post-Deployment Verification

Visit your Netlify URL and verify:
- [ ] Site loads without errors
- [ ] All pages accessible
- [ ] 3D models render correctly
- [ ] Assets load (images, WASM files)
- [ ] Mobile responsive
- [ ] Performance acceptable

## Common Issues

### Build Fails
- Check Node version (should be 18+)
- Run `npm install --legacy-peer-deps`
- Check build logs in Netlify

### WASM Files Not Loading
- Verify `/public/wasm/` files are committed
- Check Content-Type headers in netlify.toml

### 404 on Refresh
- Ensure redirects in netlify.toml are correct

## Rollback

If deployment fails:
```bash
# In Netlify dashboard
Site settings → Deploys → Click previous deploy → Publish deploy
```
