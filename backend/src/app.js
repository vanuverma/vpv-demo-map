import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { createDbClient } from './db/client.js';
import { requiresAuth } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { LocationRepository } from './repositories/locationRepository.js';
import { LocationService } from './services/locationService.js';
import { LocationController } from './controllers/locationController.js';
import { createLocationsRouter } from './routes/locations.js';

export function createApp() {
  const db = createDbClient();
  const locationRepo = new LocationRepository(db);
  const locationService = new LocationService(locationRepo);
  const locationController = new LocationController(locationService);

  const app = express();
  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json());

  app.use('/api/locations', requiresAuth, createLocationsRouter(locationController));

  app.use(errorHandler);

  return app;
}
