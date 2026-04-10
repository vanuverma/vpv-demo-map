import { getUserEmail } from '../middleware/auth.js';

export class LocationController {

  constructor(locationService) {
    this.locationService = locationService;
  }

  // GET /api/locations
  getAll = (req, res, next) => {
    try {
      const userEmail = getUserEmail(req);
      if (!userEmail) {
        res.status(401).json({ error: 'Unable to determine user identity from token' });
        return;
      }
      const locations = this.locationService.getLocationsForUser(userEmail);
      res.json(locations);
    } catch (err) {
      next(err);
    }
  };

  // POST /api/locations
  create = (req, res, next) => {
    try {
      const userEmail = getUserEmail(req);
      if (!userEmail) {
        res.status(401).json({ error: 'Unable to determine user identity from token' });
        return;
      }
      const { address, lat, lng } = req.body;
      if (lat == null || lng == null) {
        res.status(400).json({ error: 'lat and lng are required' });
        return;
      }
      const saved = this.locationService.saveLocation({ userEmail, address, lat, lng });
      res.status(201).json(saved);
    } catch (err) {
      next(err);
    }
  };

  // DELETE /api/locations/:id
  remove = (req, res, next) => {
    try {
      const userEmail = getUserEmail(req);
      if (!userEmail) {
        res.status(401).json({ error: 'Unable to determine user identity from token' });
        return;
      }
      const { id } = req.params;
      this.locationService.deleteLocation(id, userEmail);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  };
}
