# Railway Deployment Checklist ✅

Use this checklist to track your Railway deployment progress:

## Pre-Deployment

- [ ] Railway account created and logged in
- [ ] Repository linked to Railway
- [ ] Generated JWT_SECRET (use `openssl rand -base64 32`)

## Database Setup

- [ ] Added PostgreSQL database service
- [ ] Verified `DATABASE_URL` is available in Railway variables

## Backend Deployment

- [ ] Created backend service from repository
- [ ] Set root directory to `back`
- [ ] Configured environment variables:
  - [ ] `DATABASE_URL=${{Postgres.DATABASE_URL}}`
  - [ ] `JWT_SECRET=<your-generated-secret>`
  - [ ] `JWT_EXPIRES_IN=7d`
  - [ ] `FRONTEND_URL=${{frontend.PUBLIC_URL}}` (or `*` initially)
- [ ] Generated public domain for backend
- [ ] Backend deployment successful
- [ ] Backend logs show no errors
- [ ] Verified Prisma migrations ran successfully

## Frontend Deployment

- [ ] Created frontend service from repository
- [ ] Set root directory to `front`
- [ ] Configured environment variables:
  - [ ] `NEXT_PUBLIC_API_URL=<backend-url>`
- [ ] Generated public domain for frontend
- [ ] Frontend deployment successful
- [ ] Frontend logs show no errors

## Testing

- [ ] Opened frontend URL in browser
- [ ] Frontend loads without errors
- [ ] Can register a new user
- [ ] Can login with credentials
- [ ] Can create/view data (teams, players, etc.)
- [ ] Backend API responds to requests
- [ ] Database operations work correctly

## Post-Deployment

- [ ] Updated `FRONTEND_URL` in backend to specific frontend URL (security)
- [ ] Reviewed Railway usage/costs
- [ ] Set up monitoring alerts (optional)
- [ ] Configured custom domain (optional)
- [ ] Documented public URLs for team

## URLs to Save

- **Frontend**: _____________________________________
- **Backend**: _____________________________________
- **Database**: (Internal only, managed by Railway)

## Important Credentials

- **JWT_SECRET**: (Stored securely in Railway variables)
- **Admin User**: (Create and document after deployment)

---

**Deployment Date**: _______________
**Deployed By**: _______________

**Notes**:
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________
