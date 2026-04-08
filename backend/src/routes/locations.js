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
  const { address, lat, lng } = req.body;

  if (!address || lat == null || lng == null) {
    res.status(400).json({ error: 'address, lat and lng are required' });
    return;
  }

  const result = db.prepare(
    'INSERT INTO locations (address, lat, lng) VALUES (?, ?, ?)'
  ).run(address, lat, lng);

  const saved = db.prepare('SELECT * FROM locations WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(saved);
});

export default router;
