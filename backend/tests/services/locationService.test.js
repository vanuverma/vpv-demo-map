import { LocationService } from '../../src/services/locationService.js';

// Builds a mock repo with controllable return values
function mockRepo(overrides = {}) {
  return {
    findAllByUser: overrides.findAllByUser ?? (() => []),
    create: overrides.create ?? ((loc) => ({ id: 1, ...loc })),
    deleteByIdAndUser: overrides.deleteByIdAndUser ?? (() => true),
  };
}

describe('LocationService', () => {

  describe('getLocationsForUser', () => {
    it('delegates to repo.findAllByUser with the given email', () => {
      let capturedEmail;
      const repo = mockRepo({ findAllByUser: (email) => { capturedEmail = email; return []; } });
      const service = new LocationService(repo);

      service.getLocationsForUser('user@test.com');
      expect(capturedEmail).toBe('user@test.com');
    });

    it('returns whatever the repo returns', () => {
      const fakeLocations = [{ id: 1, address: 'A' }];
      const service = new LocationService(mockRepo({ findAllByUser: () => fakeLocations }));

      const result = service.getLocationsForUser('user@test.com');
      expect(result).toEqual(fakeLocations);
    });
  });

  describe('saveLocation — address resolution', () => {
    it('passes the provided address through to the repo unchanged', () => {
      let captured;
      const repo = mockRepo({ create: (loc) => { captured = loc; return { id: 1, ...loc }; } });
      const service = new LocationService(repo);

      service.saveLocation({ userEmail: 'u@test.com', address: '123 Main St', lat: 1.1, lng: 2.2 });
      expect(captured.address).toBe('123 Main St');
    });

    it('falls back to "lat, lng" when address is empty string', () => {
      let captured;
      const repo = mockRepo({ create: (loc) => { captured = loc; return { id: 1, ...loc }; } });
      const service = new LocationService(repo);

      service.saveLocation({ userEmail: 'u@test.com', address: '', lat: 1.12345, lng: 2.67891 });
      expect(captured.address).toBe('1.12345, 2.67891');
    });

    it('falls back to "lat, lng" when address is null', () => {
      let captured;
      const repo = mockRepo({ create: (loc) => { captured = loc; return { id: 1, ...loc }; } });
      const service = new LocationService(repo);

      service.saveLocation({ userEmail: 'u@test.com', address: null, lat: 10, lng: 20 });
      expect(captured.address).toBe('10.00000, 20.00000');
    });

    it('falls back to "lat, lng" when address is whitespace only', () => {
      let captured;
      const repo = mockRepo({ create: (loc) => { captured = loc; return { id: 1, ...loc }; } });
      const service = new LocationService(repo);

      service.saveLocation({ userEmail: 'u@test.com', address: '   ', lat: 5, lng: 6 });
      expect(captured.address).toBe('5.00000, 6.00000');
    });
  });

  describe('deleteLocation', () => {
    it('calls repo.deleteByIdAndUser with correct arguments', () => {
      let capturedId, capturedEmail;
      const repo = mockRepo({
        deleteByIdAndUser: (id, email) => { capturedId = id; capturedEmail = email; return true; }
      });
      const service = new LocationService(repo);

      service.deleteLocation(42, 'user@test.com');
      expect(capturedId).toBe(42);
      expect(capturedEmail).toBe('user@test.com');
    });

    it('throws a 404 error when repo returns false (not found / wrong user)', () => {
      const service = new LocationService(mockRepo({ deleteByIdAndUser: () => false }));

      expect(() => service.deleteLocation(99, 'user@test.com')).toThrow(
        expect.objectContaining({ status: 404 })
      );
    });

    it('does not throw when deletion succeeds', () => {
      const service = new LocationService(mockRepo({ deleteByIdAndUser: () => true }));
      expect(() => service.deleteLocation(1, 'user@test.com')).not.toThrow();
    });
  });
});
