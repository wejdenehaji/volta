import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import ocrRoutes from './routes/ocr.routes';

// ... other code

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ── Security middleware ────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Vite default
  credentials: true,
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '10kb' })); // Prevent large payload attacks

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ── Health check ───────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── 404 fallback ───────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: 'Not found' }));
app.use('/api/ocr', ocrRoutes); // This makes the URL: http://localhost:4000/api/ocr/scan


app.listen(PORT, () => {
  console.log(`[server] Running on http://localhost:${PORT}`);
});

export default app;
console.log("ENV TEST:", process.env.SUPABASE_URL);