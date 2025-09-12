# Deployment Guide for Auralis

## Quick Deploy Options

### 1. Render (Recommended for Full-Stack)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

1. Connect your GitHub repository
2. Create a new Web Service
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NODE_ENV`: `production`
   - `SESSION_SECRET`: Generate a secure random string

### 2. Vercel (Great for Frontend + Serverless)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com)

1. Connect repository to Vercel
2. Set framework preset to "Vite"
3. Configure environment variables in dashboard
4. Auto-deploys on every push to main

### 3. Railway (Full-Stack with Database)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app)

1. Connect GitHub repository
2. Add PostgreSQL service
3. Set environment variables automatically
4. Deploy with one click

### 4. Fly.io (Global Edge Deployment)
```bash
# Install Fly CLI
npm install -g @flydotio/flyctl

# Login and deploy
fly auth login
fly launch
fly deploy
```

## Environment Variables Required

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:port/database

# Application
NODE_ENV=production
PORT=5000
SESSION_SECRET=your-super-secure-secret-key

# Optional: Email services
MAILEROO_API_KEY=your-key
MAILJET_API_KEY=your-key
MAILJET_SECRET_KEY=your-secret
```

## Manual Deployment Steps

### Production Build
```bash
npm install
npm run build
npm start
```

### Docker Deployment
```bash
docker build -t auralis .
docker run -p 5000:5000 auralis
```

### Database Setup
1. Create PostgreSQL database
2. Set DATABASE_URL environment variable
3. Run migrations: `npm run db:migrate`

## Monitoring & Scaling

- Health check endpoint: `/api/health`
- Logs: Monitor application logs in hosting platform
- Database: Monitor connection pool and query performance
- Scaling: Most platforms auto-scale based on traffic

## Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] API endpoints respond correctly
- [ ] Database connection established
- [ ] Environment variables configured
- [ ] SSL certificate active
- [ ] Custom domain configured (optional)
- [ ] Monitoring alerts set up
