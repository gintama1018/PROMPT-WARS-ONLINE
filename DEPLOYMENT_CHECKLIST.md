# Render Deployment Checklist

Use this checklist to ensure a smooth deployment to Render.

## Pre-Deployment ✅

- [ ] All code changes committed and pushed to GitHub
- [ ] `.env.example` file is up to date
- [ ] `render.yaml` is in the repository root
- [ ] All tests pass: `pnpm run test`
- [ ] Build succeeds: `pnpm run build`
- [ ] No security vulnerabilities: `pnpm audit`
- [ ] Code is formatted: `pnpm run format:check`
- [ ] No linting errors: `pnpm run lint`

## Render Setup ✅

### Create Blueprint (Recommended)

- [ ] Go to https://dashboard.render.com
- [ ] Click "New +" → "Blueprint"
- [ ] Select your GitHub repository
- [ ] Render auto-detects `render.yaml`
- [ ] Review auto-detected services

### Environment Variables

- [ ] Set `GEMINI_API_KEY`
  - Get key from Google Cloud Console
  - Format: `sk-...` (ensure proper format)
  
- [ ] Set `SESSION_SECRET`
  - Generate 32+ random characters
  - Use: `openssl rand -base64 32`

- [ ] Set `NODE_ENV`
  - Value: `production`

- [ ] Verify `DATABASE_URL`
  - Auto-set by Render PostgreSQL
  - Format: `postgresql://user:password@host/dbname`

- [ ] Set `VITE_API_URL` (Frontend only)
  - Value: `https://election-guide-api.onrender.com/api`

### Database Configuration

- [ ] PostgreSQL database created
- [ ] Database name: `election_guide`
- [ ] Database user: `election_guide_user`
- [ ] Backups enabled
- [ ] Plan: Standard (or higher)

## Deployment ✅

- [ ] Blueprint created successfully
- [ ] All services showing as "deploying"
- [ ] API service build succeeds
- [ ] Frontend service build succeeds
- [ ] Database migrations executed
- [ ] Services show as "running"

## Post-Deployment Verification ✅

### API Health Check

```bash
curl https://election-guide-api.onrender.com/api/healthz
```

Expected response:
```json
{"status": "ok"}
```

- [ ] Health check endpoint responds
- [ ] Response status is 200 OK
- [ ] No CORS errors in logs

### Frontend Testing

- [ ] Visit https://election-guide-frontend.onrender.com
- [ ] Page loads without errors
- [ ] Navigation works
- [ ] Home page displays correctly
- [ ] Images load properly

### Feature Testing

- [ ] ✅ Home page loads
- [ ] ✅ What Is Election page works
- [ ] ✅ Timeline page displays correctly
- [ ] ✅ How To Vote page functional
- [ ] ✅ Your Rights page accessible
- [ ] ✅ Chat interface functional
  - Send test message to Gemini AI
  - Verify streaming response works
- [ ] ✅ Quiz page loads and scores work
- [ ] ✅ Share score functionality works

### Performance Checks

- [ ] Run Lighthouse audit
  - Target: 90+ score
  - Check: Performance, Accessibility, Best Practices

- [ ] Check Core Web Vitals
  - LCP: < 2.5s
  - FID: < 100ms
  - CLS: < 0.1

- [ ] Monitor response times
  - API average: < 200ms
  - Page load: < 2s

### Error Logging

- [ ] Check error logs in Render
- [ ] No critical errors in logs
- [ ] No unhandled promise rejections
- [ ] Database connections stable

## Monitoring Setup ✅

### Render Dashboard

- [ ] Enable "Notify on deploy failures"
- [ ] Configure email notifications
- [ ] Set up error alerts
- [ ] Monitor dashboard daily for first week

### Log Monitoring

- [ ] API logs: no errors
- [ ] Database logs: no issues
- [ ] Frontend logs: no console errors

## Optional Enhancements ✅

- [ ] Configure custom domain
  - Domain: `electionguide.yoursite.com`
  - SSL: Auto-configured by Render

- [ ] Set up monitoring/alerting
  - Uptime monitoring
  - Error rate alerts
  - Performance degradation alerts

- [ ] Configure auto-deploys
  - Trigger on: GitHub push to main
  - Automatic rollback on failure

- [ ] Set resource limits
  - Monitor CPU usage
  - Monitor memory usage
  - Adjust plan if needed

## Troubleshooting Checklist ✅

### Build Failures

- [ ] Check build logs in Render dashboard
- [ ] Verify all environment variables are set
- [ ] Ensure Node version is 22.x+
- [ ] Clear build cache and retry
- [ ] Check for uncommitted changes in tests

### Runtime Errors

- [ ] Check service logs
- [ ] Verify database connection string
- [ ] Restart service from dashboard
- [ ] Check disk space usage
- [ ] Review recent code changes

### API Connection Issues

- [ ] Verify API service is running
- [ ] Check CORS headers
- [ ] Verify `VITE_API_URL` is correct
- [ ] Check API logs for errors
- [ ] Test health endpoint

### Database Issues

- [ ] Verify database is running
- [ ] Check database credentials
- [ ] Run migrations manually if needed
- [ ] Check disk space
- [ ] Review database logs

## Post-Go-Live ✅

### First 24 Hours

- [ ] Monitor error logs closely
- [ ] Check user feedback
- [ ] Monitor performance metrics
- [ ] Be ready to rollback if needed

### First Week

- [ ] Daily log review
- [ ] Performance monitoring
- [ ] Error tracking
- [ ] Update documentation with actual URLs

### Ongoing

- [ ] Weekly performance reviews
- [ ] Monthly security audits
- [ ] Quarterly dependency updates
- [ ] Continuous monitoring

## Important Links

- 📊 Render Dashboard: https://dashboard.render.com
- 📖 Documentation: https://render.com/docs
- 🆘 Support: support@render.com
- 🐛 Issue Tracker: https://github.com/yourusername/PROMPT-WARS-ONLINE/issues

## Contact & Support

- **Deployment Issues**: Check Render dashboard logs
- **Application Issues**: File GitHub issue
- **Security Concerns**: Email security@prompt-wars-election-guide.dev

---

**Estimated Deployment Time**: 15-20 minutes

**Success Indicator**: All services showing "running" and health check returns OK
