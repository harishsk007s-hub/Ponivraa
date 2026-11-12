import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { connectDB, isConnectedToMongoDB } from './config/db.js';
import { seedDatabase } from './seed/seedData.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

// Fail fast if required environment variables are missing
const validateEnvironment = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const missing = [];

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim() === '') {
    missing.push('JWT_SECRET');
  }

  if (isProduction) {
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.trim() === '') {
      missing.push('MONGODB_URI');
    }
    if (!process.env.ADMIN_EMAIL || process.env.ADMIN_EMAIL.trim() === '') {
      missing.push('ADMIN_EMAIL');
    }
    if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.trim() === '') {
      missing.push('ADMIN_PASSWORD');
    }
  }

  if (missing.length > 0) {
    console.error('========================================================');
    console.error('❌ FATAL: Missing Required Environment Variables:');
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error('Please configure these in your environment (.env / Render).');
    console.error('========================================================');
    process.exit(1);
  }
};

validateEnvironment();

const app = express();

// Secure CORS configuration
const buildAllowedOrigins = () => {
  const origins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
  ];

  if (process.env.CLIENT_URL) {
    const customUrls = process.env.CLIENT_URL.split(',').map((u) => u.trim().replace(/\/+$/, ''));
    origins.push(...customUrls);
  }

  return origins;
};

const allowedOrigins = buildAllowedOrigins();

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, server-to-server, curl)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/+$/, '');

    // 1. Direct match with configured allowed origins
    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    // 2. Allow any Vercel deployment preview / production domain for this project
    try {
      const parsed = new URL(cleanOrigin);
      if (parsed.hostname.endsWith('.vercel.app')) {
        return callback(null, true);
      }
    } catch (e) {}

    // 3. Localhost origins in development mode
    if (
      process.env.NODE_ENV !== 'production' &&
      (cleanOrigin.startsWith('http://localhost:') || cleanOrigin.startsWith('http://127.0.0.1:'))
    ) {
      return callback(null, true);
    }

    console.warn(`Blocked by CORS: Origin "${origin}" is not authorized.`);
    return callback(new Error(`CORS Error: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Serve uploaded static files for development fallback
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const dbStatus = isConnectedToMongoDB
    ? 'connected'
    : isProduction
    ? 'disconnected'
    : 'in-memory-dev';

  const healthy = isConnectedToMongoDB || !isProduction;

  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'degraded',
    brand: 'Ponivraa',
    location: 'Alagarkovil, Tamil Nadu',
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/upload', uploadRoutes);

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found - ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.message);
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    console.error(err.stack);
  }

  const statusCode = err.status || (res.statusCode >= 400 ? res.statusCode : 500);
  res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production' && statusCode === 500
        ? 'Internal Server Error'
        : err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

// Connect Database and Start Server
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🌿 Ponivraa Farm-Fresh API is active!`);
      console.log(`📍 Origin: Alagarkovil, Tamil Nadu`);
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Fatal error starting server:', error.message);
    process.exit(1);
  }
};

startServer();
