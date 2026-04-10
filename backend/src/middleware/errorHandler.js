// Centralised error handler

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // express-oauth2-jwt-bearer throws structured errors
  if (err.status === 401 || err.status === 403) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
}
