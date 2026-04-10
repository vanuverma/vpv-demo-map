import { Router } from 'express';

export function createLocationsRouter(locationController) {
  const router = Router();

  router.get('/', locationController.getAll);
  router.post('/', locationController.create);
  router.delete('/:id', locationController.remove);

  return router;
}
