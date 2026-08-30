import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { agentAuthRouter } from './routes/agentAuth.js';
import { applicationsRouter } from './routes/applications.js';
import { adminRouter } from './routes/admin.js';
import { agentsRouter } from './routes/agents.js';
import { chatRouter } from './routes/chat.js';
import { inventoryRouter } from './routes/inventory.js';
import { inventoryPublicRouter } from './routes/inventoryPublic.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);

app.use(helmet({
  contentSecurityPolicy: false,
}));

// Kunin ang allowed origins at idagdag ang default cPanel domain para sigurado
const envOrigins = (process.env.ALLOWED_ORIGINS ?? '').split(',').map(s => s.trim()).filter(Boolean);
const allowedOrigins = [...new Set([...envOrigins, 'https://silverwind.website', 'http://localhost:4100'])];

app.use(cors({
  origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.onrender.com')) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));

// API Routes
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/inventory/public', inventoryPublicRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/agent', agentAuthRouter);
app.use('/api/admin/agents', agentsRouter);
app.use('/api/admin/inventory', inventoryRouter);
app.use('/api/admin', adminRouter);
app.use('/api/chat', chatRouter);

// I-serve ang static frontend files mula sa root folder
app.use(express.static(path.join(__dirname, '../../')));

// Fallback para sa anumang route na hindi natagpuan sa API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../index.html'));
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  if (err.message === 'Not allowed by CORS') return res.status(403).json({ error: 'Forbidden.' });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Malformed request.' });
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'File is too large.' });
  if (err.name === 'MulterError') return res.status(400).json({ error: 'There was a problem with one of your files.' });
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

const port = process.env.PORT || 4100;
app.listen(port, () => console.log(`dealer-backend listening on :${port}`));