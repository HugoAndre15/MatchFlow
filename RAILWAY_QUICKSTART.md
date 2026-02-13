# 🚀 Quick Railway Setup - TL;DR

If you're familiar with Railway, here's the quick version:

## 1. Create Services (3 total)

### PostgreSQL Database
- Add "Database" → "PostgreSQL"
- Note: `DATABASE_URL` is auto-created

### Backend Service
- **Root Directory**: `back`
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `npm run start:prod`
- **Environment Variables**:
  ```
  DATABASE_URL=${{Postgres.DATABASE_URL}}
  JWT_SECRET=<generate-a-secure-random-32-char-string>
  JWT_EXPIRES_IN=7d
  ```
- Generate public domain for API access

### Frontend Service
- **Root Directory**: `front`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
  ```
  NEXT_PUBLIC_API_URL=${{backend.PUBLIC_URL}}
  ```
  Or use the backend's public domain URL
- Generate public domain for web access

## 2. Deploy Order
1. PostgreSQL (deploys first)
2. Backend (waits for database)
3. Frontend (needs backend URL)

## 3. Test URLs
- Frontend: `https://your-frontend.railway.app`
- Backend API: `https://your-backend.railway.app`

## 4. Essential Commands

```bash
# Generate secure JWT secret
openssl rand -base64 32

# View logs
railway logs --service backend
railway logs --service frontend

# Run migrations manually (if needed)
railway run --service backend npx prisma migrate deploy
```

## 5. Costs
- Free tier: $5/month credit
- Expected: ~$15-25/month for production

---

**Need detailed instructions?** See [RAILWAY_SETUP.md](./RAILWAY_SETUP.md)
