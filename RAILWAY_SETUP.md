# 🚀 Railway Deployment Guide for CoachFlow

This guide will walk you through deploying your CoachFlow application (NestJS backend + Next.js frontend) on Railway with PostgreSQL database.

## 📋 Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Create Railway Project](#step-1-create-railway-project)
4. [Step 2: Add PostgreSQL Database](#step-2-add-postgresql-database)
5. [Step 3: Deploy Backend Service](#step-3-deploy-backend-service)
6. [Step 4: Deploy Frontend Service](#step-4-deploy-frontend-service)
7. [Step 5: Configure Environment Variables](#step-5-configure-environment-variables)
8. [Step 6: Deploy and Test](#step-6-deploy-and-test)
9. [Troubleshooting](#troubleshooting)
10. [Cost Estimation](#cost-estimation)

---

## Overview

CoachFlow consists of:
- **Backend**: NestJS API (Port 3001) with Prisma ORM
- **Frontend**: Next.js application (Port 3000)
- **Database**: PostgreSQL

Railway will host all three services and automatically handle networking between them.

---

## Prerequisites

- ✅ Railway account (sign up at [railway.app](https://railway.app))
- ✅ GitHub repository linked to Railway
- ✅ Basic understanding of environment variables

---

## Step 1: Create Railway Project

1. **Login to Railway**: Go to [railway.app](https://railway.app) and sign in
2. **Create New Project**: 
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `CoachFlow` repository
   - Railway will detect it's a monorepo with multiple services

---

## Step 2: Add PostgreSQL Database

1. **Add Database Service**:
   - In your Railway project, click "+ New"
   - Select "Database"
   - Choose "PostgreSQL"
   - Railway will provision a PostgreSQL instance

2. **Note the Connection Details**:
   - Railway automatically creates a `DATABASE_URL` variable
   - This will be available to your services automatically through Railway's internal networking

---

## Step 3: Deploy Backend Service

1. **Create Backend Service**:
   - Click "+ New" in your Railway project
   - Select "GitHub Repo"
   - Choose your CoachFlow repository (if not already added)
   - Railway will detect multiple services

2. **Configure Backend Service**:
   - **Service Name**: `backend` or `coachflow-backend`
   - **Root Directory**: Click on Settings → Set to `back`
   - **Build Command**: Leave default (Railway will use `npm install && npm run build`)
   - **Start Command**: `npm run start:prod`

3. **Set Backend Environment Variables**:
   
   Go to your backend service → Variables tab and add:

   ```bash
   # Database (Reference from PostgreSQL service)
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   
   # JWT Configuration (IMPORTANT: Generate a secure secret!)
   JWT_SECRET=your-super-secure-random-secret-key-at-least-32-characters-long
   JWT_EXPIRES_IN=7d
   
   # Port (Railway sets this automatically, but you can specify)
   PORT=3001
   ```

   **⚠️ IMPORTANT**: Replace `JWT_SECRET` with a strong random string. You can generate one using:
   ```bash
   openssl rand -base64 32
   ```
   Or use an online generator like [https://randomkeygen.com/](https://randomkeygen.com/)

4. **Enable Public Domain** (Optional but recommended):
   - Go to Settings → Networking
   - Click "Generate Domain" to get a public URL like `backend.railway.app`
   - Note this URL - you'll need it for the frontend

---

## Step 4: Deploy Frontend Service

1. **Create Frontend Service**:
   - Click "+ New" in your Railway project
   - Select "GitHub Repo" (if not already added)
   - Add a new service from the same repository

2. **Configure Frontend Service**:
   - **Service Name**: `frontend` or `coachflow-frontend`
   - **Root Directory**: Click on Settings → Set to `front`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

3. **Set Frontend Environment Variables**:
   
   Go to your frontend service → Variables tab and add:

   ```bash
   # Backend API URL (use the Railway internal URL or public domain)
   NEXT_PUBLIC_API_URL=${{backend.PUBLIC_URL}}
   ```

   **OR** if you generated a public domain for the backend:
   ```bash
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```

4. **Enable Public Domain**:
   - Go to Settings → Networking
   - Click "Generate Domain" to get a public URL like `frontend.railway.app`
   - This is your application's public URL!

---

## Step 5: Configure Environment Variables

### Backend Variables Summary

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | PostgreSQL connection string (auto-configured) |
| `JWT_SECRET` | Your secure random string | Secret key for JWT tokens (min 32 chars) |
| `JWT_EXPIRES_IN` | `7d` | JWT token expiration time |
| `PORT` | `3001` | Server port (optional, Railway auto-assigns) |

### Frontend Variables Summary

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `${{backend.PUBLIC_URL}}` or `https://your-backend.railway.app` | Backend API URL |

---

## Step 6: Deploy and Test

### Deployment Process

1. **Trigger Deployment**:
   - Railway automatically deploys when you push to your repository
   - Or manually click "Deploy" in the Railway dashboard

2. **Monitor Deployment**:
   - Click on each service to see build logs
   - Backend should show:
     - ✅ Dependencies installed
     - ✅ Prisma client generated
     - ✅ Database migrations applied
     - ✅ Server started on PORT
   - Frontend should show:
     - ✅ Dependencies installed
     - ✅ Next.js build completed
     - ✅ Server started

3. **Run Database Migrations**:
   
   The backend Dockerfile already includes migration logic, but if you need to run migrations manually:
   
   - Go to backend service
   - Click on "Settings" → "Deploy"
   - Or use Railway CLI:
     ```bash
     railway run npx prisma migrate deploy
     ```

### Testing Your Deployment

1. **Test Backend**:
   ```bash
   # Check health/root endpoint
   curl https://your-backend.railway.app
   
   # Should return something like "Hello World!" or API documentation
   ```

2. **Test Frontend**:
   - Open `https://your-frontend.railway.app` in your browser
   - You should see the CoachFlow application
   - Try to register/login to test the full stack

3. **Test Database Connection**:
   - Register a new user through the frontend
   - Login with the credentials
   - Create a team/club to verify database operations

---

## Troubleshooting

### Common Issues and Solutions

#### 1. **Backend fails to start - "Cannot find Prisma Client"**

**Solution**: Make sure Prisma is generating the client during build
- Check that `prisma generate` runs in the build process
- In backend service Settings → Custom Build Command:
  ```bash
  npm install && npx prisma generate && npm run build
  ```

#### 2. **Database connection errors**

**Solution**: 
- Verify `DATABASE_URL` is correctly set in backend variables
- Check that PostgreSQL service is running
- Make sure you're using `${{Postgres.DATABASE_URL}}` format

#### 3. **Frontend can't reach backend**

**Solution**:
- Verify `NEXT_PUBLIC_API_URL` is correctly set
- Make sure backend has a public domain generated
- Check CORS settings in backend (NestJS)
- Add CORS configuration if needed in `back/src/main.ts`:
  ```typescript
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: process.env.FRONTEND_URL || '*',
      credentials: true,
    });
    await app.listen(process.env.PORT ?? 3001);
  }
  ```

#### 4. **Build fails - "Out of Memory"**

**Solution**: 
- Upgrade your Railway plan for more resources
- Or optimize your build process to use less memory

#### 5. **Migrations don't run automatically**

**Solution**:
- Add a migration command to your start script
- Or run migrations manually via Railway CLI:
  ```bash
  railway link
  railway run --service backend npx prisma migrate deploy
  ```

#### 6. **Environment variables not updating**

**Solution**:
- After changing variables, redeploy the service
- Go to Deployments → Click "Redeploy" on latest deployment

---

## Cost Estimation

Railway pricing (as of 2024):

### Free Tier (Hobby Plan)
- **$5 worth of usage per month** (includes)
- Suitable for development and testing
- Automatically scales down when not in use

### Paid Usage
- **Per service**: ~$5-10/month depending on usage
- **PostgreSQL**: ~$5/month (1GB storage)
- **Estimated total**: $15-25/month for all services

### Tips to Reduce Costs
1. Use sleep mode for non-production services
2. Remove unused services
3. Optimize database queries to reduce CPU usage
4. Use Railway's usage dashboard to monitor costs

---

## Additional Configuration

### Custom Domains

To use your own domain (e.g., `coachflow.com`):

1. Go to service Settings → Networking
2. Click "Custom Domain"
3. Add your domain (e.g., `api.coachflow.com` for backend)
4. Add the provided CNAME records to your DNS provider
5. Railway handles SSL certificates automatically

### Database Backups

Railway PostgreSQL includes:
- Automatic daily backups (retained for 7 days on Hobby, more on Pro)
- Point-in-time recovery available on Pro plan

To manually backup:
```bash
railway link
railway run --service postgres pg_dump > backup.sql
```

### Monitoring and Logs

- **View Logs**: Click on any service → "Logs" tab
- **Metrics**: Click on service → "Metrics" to see CPU, Memory, Network usage
- **Alerts**: Set up in Settings → Notifications

---

## Railway CLI (Optional but Powerful)

Install Railway CLI for easier management:

```bash
# Install
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run commands in Railway environment
railway run npm run db:migrate

# View logs
railway logs

# Open service in browser
railway open
```

---

## Next Steps

1. ✅ Monitor your deployments in Railway dashboard
2. ✅ Set up custom domains if needed
3. ✅ Configure database backups
4. ✅ Set up monitoring/alerts
5. ✅ Test all functionality thoroughly
6. ✅ Share your live URL with users!

---

## Resources

- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord Community](https://discord.gg/railway)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [NestJS Deployment](https://docs.nestjs.com/deployment)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## Support

If you encounter issues:
1. Check Railway logs for each service
2. Review this guide's troubleshooting section
3. Join Railway Discord for community support
4. Check Railway status page: [status.railway.app](https://status.railway.app)

---

**Happy Deploying! 🎉**

Your CoachFlow application should now be live and accessible to users worldwide!
