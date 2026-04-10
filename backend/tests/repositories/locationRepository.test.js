import Database from 'better-sqlite3';
import { LocationRepository } from '../../src/repositories/locationRepository.js';

// Uses a real in-memory SQLite DB — no mocking needed for the repository layer
function createTestDb() {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE locations (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      userEmail  TEXT NOT NULL,
      address    TEXT NOT NULL,
      lat        REAL NOT NULL,
      lng        REAL NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  return db;
}

describe('LocationRepository', () => {
  let db;
  let repo;

  beforeAll(() => {
    db = createTestDb();
    repo = new LocationRepository(db);
  });

  afterAll(() => db.close());

  describe('create & findById', () => {
    it('inserts a location and returns it with an id', () => {
      const location = { userEmail: 'a@test.com', address: '123 Main St', lat: 1.1, lng: 2.2 };
      const saved = repo.create(location);

      expect(saved.id).toBeTruthy();
      expect(saved.userEmail).toBe(location.userEmail);
      expect(saved.address).toBe(location.address);
      expect(saved.lat).toBe(location.lat);
      expect(saved.lng).toBe(location.lng);
    });

    it('findById returns null for a non-existent id', () => {
      const result = repo.findById(99999);
      expect(result).toBeUndefined();
    });
  });

  describe('findAllByUser', () => {
    it('returns only locations belonging to the given user', () => {
      const db2 = createTestDb();
      const r = new LocationRepository(db2);
      r.create({ userEmail: 'alice@test.com', address: 'A', lat: 1, lng: 1 });
      r.create({ userEmail: 'alice@test.com', address: 'B', lat: 2, lng: 2 });
      r.create({ userEmail: 'bob@test.com', address: 'C', lat: 3, lng: 3 });

      const results = r.findAllByUser('alice@test.com');
      expect(results).toHaveLength(2);
      expect(results.every(l => l.userEmail === 'alice@test.com')).toBe(true);
      db2.close();
    });

    it('returns results newest first (descending id order)', () => {
      const db2 = createTestDb();
      const r = new LocationRepository(db2);
      const first = r.create({ userEmail: 'u@test.com', address: 'First', lat: 1, lng: 1 });
      const second = r.create({ userEmail: 'u@test.com', address: 'Second', lat: 2, lng: 2 });

      const results = r.findAllByUser('u@test.com');
      expect(results[0].id).toBe(second.id);
      expect(results[1].id).toBe(first.id);
      db2.close();
    });

    it('returns an empty array when user has no locations', () => {
      const results = repo.findAllByUser('nobody@test.com');
      expect(results).toEqual([]);
    });
  });

  describe('deleteByIdAndUser', () => {
    it('deletes the location and returns true', () => {
      const saved = repo.create({ userEmail: 'del@test.com', address: 'X', lat: 0, lng: 0 });
      const deleted = repo.deleteByIdAndUser(saved.id, 'del@test.com');

      expect(deleted).toBe(true);
      expect(repo.findById(saved.id)).toBeUndefined();
    });

    it('returns false when location does not exist', () => {
      const result = repo.deleteByIdAndUser(99999, 'del@test.com');
      expect(result).toBe(false);
    });

    it('returns false when userEmail does not match (prevents cross-user deletion)', () => {
      const saved = repo.create({ userEmail: 'owner@test.com', address: 'Y', lat: 0, lng: 0 });
      const result = repo.deleteByIdAndUser(saved.id, 'attacker@test.com');

      expect(result).toBe(false);
      // original record must still exist
      expect(repo.findById(saved.id)).toBeDefined();
    });
  });
});
