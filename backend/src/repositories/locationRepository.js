// Repository layer for location data. Encapsulates all database access related to locations.

export class LocationRepository {
  constructor(db) {
    this.db = db;
  }

  findAllByUser(userEmail) {
    return this.db
      .prepare('SELECT * FROM locations WHERE userEmail = ? ORDER BY id DESC')
      .all(userEmail);
  }

  create({ userEmail, address, lat, lng }) {
    const result = this.db
      .prepare('INSERT INTO locations (userEmail, address, lat, lng) VALUES (?, ?, ?, ?)')
      .run(userEmail, address, lat, lng);
    return this.findById(result.lastInsertRowid);
  }

  // not exposed by emdpoint, used for test assertions
  findById(id) {
    return this.db
      .prepare('SELECT * FROM locations WHERE id = ?')
      .get(id);
  }

  deleteByIdAndUser(id, userEmail) {
    const result = this.db
      .prepare('DELETE FROM locations WHERE id = ? AND userEmail = ?')
      .run(id, userEmail);
    return result.changes > 0;
  }
}
