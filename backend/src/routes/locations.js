import { Router } from 'express';
import db from '../db.js';

const router = Router();

function getUserEmail(req) {
  const emailPropertyName = `${process.env.AUTH0_AUDIENCE}/email`;
  return req.auth?.payload?.[emailPropertyName];
}

// GET /api/locations — return all saved locations for the authenticated user, newest first
router.get('/', (req, res) => {
  const userEmail = getUserEmail(req);
  // console.log('User email:', req.auth);

  if (!userEmail) {
    res.status(401).json({ error: 'Unable to determine user identity from token' });
    return;
  }
  const locations = db.prepare('SELECT * FROM locations WHERE userEmail = ? ORDER BY id DESC').all(userEmail);
  res.json(locations);
});

// POST /api/locations — save a new location for the authenticated user
router.post('/', (req, res) => {
  const userEmail = getUserEmail(req);
  // console.log('User email:', req.auth);

  if (!userEmail) {
    res.status(401).json({ error: 'Unable to determine user identity from token' });
    return;
  }

  const { address, lat, lng } = req.body;

  if (lat == null || lng == null) {
    res.status(400).json({ error: 'lat and lng are required' });
    return;
  }

  const resolvedAddress = address || `${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)}`;

  const result = db.prepare(
    'INSERT INTO locations (userEmail, address, lat, lng) VALUES (?, ?, ?, ?)'
  ).run(userEmail, resolvedAddress, lat, lng);

  const saved = db.prepare('SELECT * FROM locations WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(saved);
});


// DELETE /api/locations/:id — delete a location for the authenticated user
router.delete('/:id', (req, res) => {
  const userEmail = getUserEmail(req);
  // console.log('User email:', req.auth);

  if (!userEmail) {
    res.status(401).json({ error: 'Unable to determine user identity from token' });
    return;
  }

  const locationId = req.params.id;
  if (!locationId) {
    res.status(400).json({ error: 'Location ID is required' });
    return;
  }
  const result = db.prepare('DELETE FROM locations WHERE id = ? AND userEmail = ?').run(locationId, userEmail);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Location not found or not authorized' });
    return;
  }

  res.status(204).end();
});

export default router;
