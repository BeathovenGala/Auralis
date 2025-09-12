# Auralis - Space Weather Operations Platform

Auralis is a professional, full-stack space weather monitoring and prediction platform built with modern web technologies. It provides real-time geomagnetic storm alerts, satellite operations monitoring, and ML-powered forecasting capabilities.

## 🚀 Architecture

- **Frontend**: React 18, TypeScript, Wouter routing, ShadCN-UI components, Tailwind CSS
- **Backend**: Node.js, Express.js, Drizzle ORM, PostgreSQL
- **Deployment**: Docker, CI/CD with GitHub Actions, Render/Vercel compatible
- **ML**: Random Forest model for geomagnetic storm prediction
- **Real-time**: Space weather data ingestion and processing pipeline

## 🛠️ Quick Start

### Development Setup

1. **Clone and install dependencies**:
   ```bash
   git clone <your-repo-url>
   cd GeostormGuardian
   npm install
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and configuration
   ```

3. **Database setup**:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

### Production Deployment

#### Docker (Recommended)
```bash
npm run docker:build
npm run docker:run
```

#### Manual Deployment
```bash
npm run build
npm start
```

## 📁 Project Structure

```
├── client/src/
│   ├── screens/           # Full-page components (formerly pages)
│   ├── components/        # Reusable UI components
│   ├── services/          # API layer and external services
│   ├── navigation/        # Routing configuration
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and configurations
│   └── assets/            # Static assets
├── server/
│   ├── routes/            # API endpoint definitions
│   ├── services/          # Business logic layer
│   ├── controllers/       # Request/response handling
│   ├── db.ts              # Database connection
│   └── index.ts           # Server entry point
├── shared/
│   └── schema.ts          # Shared TypeScript schemas
└── migrations/            # Database migration files
```

## 🎯 Key Features

### Space Weather Monitoring
- Real-time OMNI2 space weather data ingestion
- Geomagnetic storm level classification (G1-G5)
- Dst index tracking and visualization
- Solar wind parameter monitoring

### Operations Support
- Satellite operations impact assessment
- Aviation radiation exposure alerts
- Human spaceflight mission planning
- Critical infrastructure monitoring

### ML-Powered Forecasting
- Random Forest model for Dst prediction
- Feature importance analysis
- Confidence scoring
- Model performance metrics

### Professional UI/UX
- Dark/light theme support
- Responsive design
- Real-time data visualization
- Interactive charts and maps

## 🔧 Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run check` | TypeScript type checking |
| `npm run db:generate` | Generate migration files |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Drizzle Studio |

## 🚢 Deployment Options

### Free Tier Hosting
- **Render**: Automatic deployments, PostgreSQL included
- **Vercel**: Frontend optimization, serverless functions
- **Railway**: Full-stack with database
- **Fly.io**: Global edge deployment

### Configuration
Set these environment variables for production:
```
DATABASE_URL=your_postgresql_connection_string
NODE_ENV=production
SESSION_SECRET=your_secure_session_secret
PORT=5000
```

## 📊 API Endpoints

- `GET /api/health` - Health check
- `GET /api/omni2/latest` - Latest space weather data
- `GET /api/forecasts/latest` - Current storm forecasts
- `GET /api/alerts/active` - Active alerts
- `POST /api/model/predict` - ML prediction
- `GET /api/sources` - Data source status

## 🔄 CI/CD Pipeline

Automated testing and deployment via GitHub Actions:
- TypeScript compilation check
- Build verification
- Automatic deployment to Render on main branch push

## 📈 Performance Optimizations

- **Bundle Size**: Wouter (1.36KB) vs React Router (11KB)
- **Code Splitting**: Component-level imports
- **Caching**: Query client for API responses
- **Database**: Optimized queries with Drizzle ORM
- **CDN**: Static asset delivery

## 🔐 Security Features

- Environment variable protection
- Session management
- Input validation with Zod schemas
- CORS configuration
- Production-ready error handling

## 📚 Technology Stack

### Frontend Dependencies
- React 18 + TypeScript
- Wouter (minimal routing)
- ShadCN-UI + Radix primitives
- TanStack Query (data fetching)
- Tailwind CSS + PostCSS
- Framer Motion (animations)

### Backend Dependencies
- Express.js + TypeScript
- Drizzle ORM + PostgreSQL
- Zod (validation)
- dotenv (environment)
- ws (WebSockets)

### Development Tools
- Vite (build tool)
- ESBuild (server bundling)
- Drizzle Kit (migrations)
- TSX (TypeScript runner)
- Docker + Docker Compose

## 🌟 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run check`
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Auralis** - Built for the future of space weather operations. 🚀🌌
