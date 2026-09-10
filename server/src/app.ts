import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { randomUUID } from 'node:crypto';
import { env } from './config/env.js';
import { validateSession } from './middleware/auth.js';
import { errorHandler, notFound } from './middleware/errors.js';
import { api } from './routes/index.js';

export const app = express();
app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false }));
app.use(express.json({ limit: '1mb' }));
app.use((req, _res, next) => { console.info(JSON.stringify({ level: 'info', method: req.method, path: req.path, requestId: randomUUID() })); next(); });
app.use('/api', validateSession, api);
app.use(notFound);
app.use(errorHandler);
