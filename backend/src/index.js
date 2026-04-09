import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { auth } from 'express-oauth2-jwt-bearer';
import locationsRouter from './routes/locations.js';

const app = express();
const PORT = process.env.PORT ?? 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173';

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Validate Auth0 JWT on every /api route
const requiresAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  tokenSigningAlg: 'RS256',
});

app.use('/api/locations', requiresAuth, locationsRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
