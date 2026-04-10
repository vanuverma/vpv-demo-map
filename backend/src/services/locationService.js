// Business logic layer for location management.

export class LocationService {
  constructor(repo) {
    this.repo = repo;
  }

  getLocationsForUser(userEmail) {
    return this.repo.findAllByUser(userEmail);
  }

  saveLocation({ userEmail, address, lat, lng }) {
    const resolvedAddress = address?.trim() ||
      `${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)}`;
    return this.repo.create({ userEmail, address: resolvedAddress, lat, lng });
  }

  deleteLocation(id, userEmail) {
    const deleted = this.repo.deleteByIdAndUser(id, userEmail);
    if (!deleted) {
      const err = new Error('Location not found or not authorized');
      err.status = 404;
      throw err;
    }
  }
}
