import { auth } from 'express-oauth2-jwt-bearer';
import { config } from '../config.js';

// JWT validation middleware — rejects requests without a valid Auth0 bearer token
export const requiresAuth = auth({
  audience: config.auth0.audience,
  issuerBaseURL: `https://${config.auth0.domain}`,
  tokenSigningAlg: 'RS256',
});

// Extract the user's email from the validated JWT payload.
export function getUserEmail(req) {
  const claimKey = `${config.auth0.audience}/email`;
  return req.auth?.payload?.[claimKey] ?? null;
}
