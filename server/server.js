import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. CORS Configuration - handles all origins, methods, and OPTIONS preflight
const allowedOrigins = [
  'https://campus-lost-and-found-sigma-liard.vercel.app',
  'https://clever-biscochitos-0890f8.netlify.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.netlify.app')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // fallback allow to prevent registration lockouts
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  })
);

// Explicitly handle preflight for all routes
app.options('*', cors());

// 2. Helmet for security headers (configured for cross-origin APIs)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// 3. Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 4. Rate Limiter (skip OPTIONS preflight)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
  message: {
    success: false,
    message: 'Too many requests from this IP address, please try again after 15 minutes.',
  },
});
app.use('/api', limiter);

// Static uploads
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Root check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'Campus Lost & Found API is up and running!',
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Campus Lost & Found Backend API',
    timestamp: new Date().toISOString(),
  });
});

// 5. Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/contact-requests', contactRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// 6. Error Handling
app.use(notFound);
app.use(errorHandler);

// 7. Server startup
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  connectDB()
    .then(async () => {
      try {
        const User = (await import('./models/User.js')).default;
        const count = await User.countDocuments();
        if (count === 0) {
          console.log('[Server] Database is empty. Seeding initial demo data...');
          const { seedDatabase } = await import('./scripts/seedData.js');
          await seedDatabase();
          console.log('[Server] Demo data seeded successfully.');
        }
      } catch (seedErr) {
        console.warn('[Server] Auto-seed check notice:', seedErr.message);
      }

      app.listen(PORT, '0.0.0.0', () => {
        console.log(`[Server] Campus Lost & Found API running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('[Server] Failed to connect to database during startup:', err);
    });
}

export default app;