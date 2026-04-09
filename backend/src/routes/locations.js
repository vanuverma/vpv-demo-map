import { Router } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/locations — return all saved locations, newest first
router.get('/', (req, res) => {
  const { userEmail } = req.query;
  if (!userEmail) {
    res.status(400).json({ error: 'userEmail is required' });
    return;
  }
  const locations = db.prepare('SELECT * FROM locations WHERE userEmail = ? ORDER BY id DESC').all(userEmail);
  res.json(locations);
});

// POST /api/locations — save a new location
router.post('/', (req, res) => {
  const { userEmail, address, lat, lng } = req.body;
  // console.log('Received new location:', { userEmail, address, lat, lng });

  if (!userEmail || lat == null || lng == null) {
    res.status(400).json({ error: 'userEmail, lat and lng are required' });
    return;
  }

  const resolvedAddress = address || `${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)}`;

  const result = db.prepare(
    'INSERT INTO locations (userEmail, address, lat, lng) VALUES (?, ?, ?, ?)'
  ).run(userEmail, resolvedAddress, lat, lng);

  const saved = db.prepare('SELECT * FROM locations WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(saved);
});

export default router;
