# Nepix Frontend - Deployment Guide

## ✅ Configuration Complete

The frontend has been configured for production deployment on GitHub Pages.

### Changes Made

1. **API Endpoint Updated**
   - File: `js/auth-utils.js`
   - Changed: `http://localhost:5000/api` → `https://nepix-backend.onrender.com/api`
   - Note: Update this URL after deploying backend to Render

2. **Landing Page**
   - Renamed: `Nepix.html` → `index.html`
   - All internal links updated to reference `index.html`

3. **Custom Domain**
   - Created: `CNAME` file with `nepix.qzz.io`
   - Configured for GitHub Pages custom domain

4. **Path Verification**
   - ✅ All CSS/JS links use relative paths
   - ✅ No absolute paths that would break on deployment

---

## GitHub Pages Deployment

### Steps

1. **Create GitHub Repository**
   ```bash
   cd nepix-deploy/frontend
   git init
   git add .
   git commit -m "Initial frontend deployment"
   ```

2. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/nepix-frontend.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch `main` → `/` (root)
   - Save

4. **Configure Custom Domain**
   - In GitHub Pages settings, enter: `nepix.qzz.io`
   - Ensure CNAME file is in root directory
   - Wait for DNS propagation

### DNS Configuration

Add these records to your DNS provider (qzz.io):

```
Type: CNAME
Name: nepix
Value: YOUR_USERNAME.github.io
```

Or use A records:
```
Type: A
Name: nepix
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

---

## After Backend Deployment

Once you deploy the backend to Render, update the API URL:

1. Get your Render URL (e.g., `https://nepix-api-xyz.onrender.com`)
2. Edit `js/auth-utils.js`:
   ```javascript
   const API_URL = 'https://YOUR-RENDER-URL.onrender.com/api';
   ```
3. Commit and push changes

---

## File Structure

```
frontend/
├── index.html          # Landing page (was Nepix.html)
├── Login.html          # Login page
├── Register.html       # Registration page
├── about.html          # About page
├── features.html       # Features page
├── Descargas.html      # Downloads page
├── CNAME              # Custom domain config
├── css/               # Stylesheets
├── js/                # JavaScript
│   └── auth-utils.js  # ✅ Updated API endpoint
└── images/            # Assets
```

---

## Testing Locally

```bash
# Simple HTTP server
cd nepix-deploy/frontend
python3 -m http.server 8000

# Visit: http://localhost:8000
```

---

## CORS Verification

The backend is configured to accept requests from:
- `https://nepix.qzz.io`
- `http://localhost` (for local development)

If you use a different domain, update `backend/app.py`:
```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://your-domain.com"]
    }
})
```

---

## Troubleshooting

### API not connecting
- Check browser console for CORS errors
- Verify backend URL in `js/auth-utils.js`
- Ensure backend is deployed and running

### Custom domain not working
- Verify CNAME file contains only `nepix.qzz.io`
- Check DNS propagation: `dig nepix.qzz.io`
- Wait up to 24 hours for DNS changes

### Links broken
- All internal links should use relative paths
- Logo/nav should link to `index.html` not `Nepix.html`

---

## Next Steps

1. ✅ Frontend configured
2. 🚀 Deploy backend to Render (get URL)
3. 📝 Update `js/auth-utils.js` with real Render URL
4. 📦 Push to GitHub
5. ⚙️ Enable GitHub Pages
6. 🌐 Configure DNS for `nepix.qzz.io`
7. 🔒 Enable HTTPS in GitHub Pages settings
8. ✨ Test end-to-end functionality
