# Deploying to Render

This guide explains how to deploy the Election Guide application on Render.

## Prerequisites

- GitHub repository with this project
- Render.com account
- Google Gemini API key (for AI chat feature)

## Deployment Options

### Option 1: Using render.yaml (Recommended)

The `render.yaml` file in the root directory defines the complete deployment configuration.

1. **Push to GitHub**
   ```bash
   git add render.yaml .env.example
   git commit -m "feat: add Render deployment configuration"
   git push origin main
   ```

2. **Connect to Render**
   - Go to https://dashboard.render.com
   - Click "New +" → "Blueprint"
   - Select your GitHub repository
   - Render will automatically detect and parse `render.yaml`

3. **Configure Environment Variables**
   - Set `GEMINI_API_KEY` with your Google Gemini API key
   - Set `SESSION_SECRET` with a random 32+ character string
   - Database credentials will be auto-provisioned

4. **Deploy**
   - Click "Create Blueprint"
   - Render will deploy both frontend and API services

### Option 2: Manual Web Service Setup

If you prefer to configure manually:

#### API Server Service

1. Create a new Web Service
   - **Name**: election-guide-api
   - **Language**: Node.js
   - **Build Command**: `pnpm install --frozen-lockfile && pnpm run build`
   - **Start Command**: `pnpm --filter @workspace/api-server run start`
   - **Plan**: Standard

2. Add Database
   - Attach a PostgreSQL database
   - Name: `election-guide-db`

3. Environment Variables
   ```
   NODE_ENV=production
   PORT=8080
   DATABASE_URL=[Auto-set by Render]
   GEMINI_API_KEY=[Your API Key]
   SESSION_SECRET=[Random 32+ chars]
   ```

4. Pre-Deploy Command
   ```
   cd lib/db && pnpm run push
   ```

#### Frontend Service

1. Create another Web Service
   - **Name**: election-guide-frontend
   - **Language**: Node.js
   - **Build Command**: `pnpm install --frozen-lockfile && pnpm run build`
   - **Start Command**: `pnpm --filter @workspace/election-guide run serve`
   - **Plan**: Standard

2. Environment Variables
   ```
   NODE_ENV=production
   VITE_API_URL=https://election-guide-api.onrender.com/api
   ```

## Post-Deployment

### Verify Deployment

```bash
# Check API health
curl https://election-guide-api.onrender.com/api/healthz
# Expected response: {"status": "ok"}

# Check frontend
# Visit: https://election-guide-frontend.onrender.com
```

### Database Migrations

If you added the pre-deploy command, migrations will run automatically. Otherwise, run manually:

```bash
# Via Render Shell
cd lib/db && pnpm run push
```

### Troubleshooting

**Build Fails: "pnpm: command not found"**
- Ensure Node version is 22.x or higher
- Add buildpack: Node.js is selected

**Database Connection Error**
- Verify `DATABASE_URL` environment variable is set
- Check if PostgreSQL service is running
- Restart services from Render dashboard

**Frontend Can't Reach API**
- Verify `VITE_API_URL` points to correct API domain
- Check CORS headers in API server
- Verify API service is running

**SSL Certificate Issues**
- Render provides free SSL automatically
- If issues persist, regenerate certificate in settings

## Monitoring & Logs

1. **Real-Time Logs**
   - Go to Service → Logs
   - View API and build logs in real-time

2. **Deploy History**
   - Service → Deploys
   - Rollback to previous versions if needed

3. **Health Checks**
   - Add `/api/healthz` endpoint check in service settings
   - Render will monitor service health

## Environment Variables (Production)

| Variable | Source | Example |
|----------|--------|---------|
| `DATABASE_URL` | Render PostgreSQL | Auto-set |
| `NODE_ENV` | Manual | `production` |
| `PORT` | Manual | `8080` |
| `GEMINI_API_KEY` | Google Cloud | `sk-...` |
| `SESSION_SECRET` | Generate random | `abc123xyz...` |
| `VITE_API_URL` | Manual | `https://api.onrender.com/api` |

## Performance Optimization

### Caching

The frontend is built statically and served from Render's CDN:
- HTML: 1 hour cache
- CSS/JS: 1 year cache (versioned)
- Images: 1 week cache

### Database

- Standard PostgreSQL plan: 10 GB storage, $15/month
- Upgrade to higher plans if needed
- Enable auto-backups in Render dashboard

### API Rate Limiting

- Default: 100 requests per 15 minutes
- Adjust in `.env` if needed

## Scaling

### Horizontal Scaling

- Upgrade service plan from Starter → Standard → Professional
- Each plan supports more concurrent connections

### Database Scaling

- Upgrade PostgreSQL plan for more storage
- Monitor disk usage in Render dashboard

## CI/CD Integration

Render automatically deploys when you push to GitHub:

1. **On Push to main**
   - Trigger automatic deployment
   - Run build command
   - Execute pre-deploy command (migrations)
   - Start new services

2. **Automatic Rollback**
   - If deployment fails, Render keeps previous version running
   - Check logs to diagnose issues

## Cost Estimation

| Service | Plan | Cost/Month |
|---------|------|-----------|
| API Service | Standard | $7 |
| Frontend Service | Standard | $7 |
| PostgreSQL | Standard | $15 |
| **Total** | | **~$29** |

See [Render Pricing](https://render.com/pricing) for latest rates.

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Render Node.js Guide](https://render.com/docs/native-nodejs)
- [PostgreSQL on Render](https://render.com/docs/databases)
- [GitHub Integration](https://render.com/docs/github)

## Support

For deployment issues:
1. Check Render service logs
2. Review `.env` variables
3. Verify GitHub repository is connected
4. Contact Render support at support@render.com

---

**Next Steps After Deployment**

1. ✅ Test all features (Quiz, Chat, Timeline, etc)
2. ✅ Run performance tests (Lighthouse)
3. ✅ Monitor error logs
4. ✅ Configure custom domain (optional)
5. ✅ Set up alerts for downtime
