import { jest } from '@jest/globals';

const TEST_EMAIL = 'user@test.com';

// jest.unstable_mockModule is the correct ESM-native API.
// It must be called before any dynamic imports of modules that depend on auth.js.
const mockGetUserEmail = jest.fn(() => TEST_EMAIL);

jest.unstable_mockModule('../../src/middleware/auth.js', () => ({
  getUserEmail: mockGetUserEmail,
  requiresAuth: jest.fn((req, res, next) => next()),
}));

const { LocationController } = await import('../../src/controllers/locationController.js');

// Build a chainable response mock that records calls
function makeRes() {
  const res = { _status: null, _body: null, _ended: false };
  res.status = (code) => { res._status = code; return res; };
  res.json = (body) => { res._body = body; return res; };
  res.end = () => { res._ended = true; return res; };
  return res;
}

// Build a mock service with controllable behaviour
function mockService(overrides = {}) {
  return {
    getLocationsForUser: overrides.getLocationsForUser ?? (() => []),
    saveLocation: overrides.saveLocation ?? ((loc) => ({ id: 1, ...loc })),
    deleteLocation: overrides.deleteLocation ?? (() => { }),
  };
}

const fakeReq = (overrides = {}) => ({ body: {}, params: {}, ...overrides });

describe('LocationController', () => {

  beforeEach(() => {
    // Reset to default: returns a valid email
    mockGetUserEmail.mockReturnValue(TEST_EMAIL);
  });

  describe('getAll', () => {
    it('returns 200 with the list from the service', () => {
      const fakeLocations = [{ id: 1, address: 'Sydney' }];
      const controller = new LocationController(
        mockService({ getLocationsForUser: () => fakeLocations })
      );
      const res = makeRes();
      controller.getAll(fakeReq(), res, (err) => { throw err; });
      expect(res._body).toEqual(fakeLocations);
    });

    it('returns 401 when no email is in the token', () => {
      mockGetUserEmail.mockReturnValue(null);
      const controller = new LocationController(mockService());
      const res = makeRes();
      controller.getAll(fakeReq(), res, () => { });
      expect(res._status).toBe(401);
    });

    it('calls next with the error when service throws', () => {
      const boom = new Error('db error');
      const controller = new LocationController(
        mockService({ getLocationsForUser: () => { throw boom; } })
      );
      let caught;
      controller.getAll(fakeReq(), makeRes(), (err) => { caught = err; });
      expect(caught).toBe(boom);
    });
  });

  describe('create', () => {
    it('returns 201 with the saved location', () => {
      const saved = { id: 1, address: '1 St', lat: 1, lng: 2 };
      const controller = new LocationController(
        mockService({ saveLocation: () => saved })
      );
      const res = makeRes();
      controller.create(fakeReq({ body: { address: '1 St', lat: 1, lng: 2 } }), res, (err) => { throw err; });
      expect(res._status).toBe(201);
      expect(res._body).toEqual(saved);
    });

    it('returns 400 when lat is missing', () => {
      const controller = new LocationController(mockService());
      const res = makeRes();
      controller.create(fakeReq({ body: { address: 'X', lng: 2 } }), res, () => { });
      expect(res._status).toBe(400);
    });

    it('returns 400 when lng is missing', () => {
      const controller = new LocationController(mockService());
      const res = makeRes();
      controller.create(fakeReq({ body: { address: 'X', lat: 1 } }), res, () => { });
      expect(res._status).toBe(400);
    });

    it('returns 401 when no email is in the token', () => {
      mockGetUserEmail.mockReturnValue(null);
      const controller = new LocationController(mockService());
      const res = makeRes();
      controller.create(fakeReq({ body: { lat: 1, lng: 2 } }), res, () => { });
      expect(res._status).toBe(401);
    });

    it('calls next with the error when service throws', () => {
      const boom = new Error('save failed');
      const controller = new LocationController(
        mockService({ saveLocation: () => { throw boom; } })
      );
      let caught;
      controller.create(fakeReq({ body: { lat: 1, lng: 2 } }), makeRes(), (err) => { caught = err; });
      expect(caught).toBe(boom);
    });
  });

  describe('remove', () => {
    it('returns 204 on successful deletion', () => {
      const controller = new LocationController(mockService());
      const res = makeRes();
      controller.remove(fakeReq({ params: { id: '5' } }), res, (err) => { throw err; });
      expect(res._ended).toBe(true);
      expect(res._status).toBe(204);
    });

    it('returns 401 when no email is in the token', () => {
      mockGetUserEmail.mockReturnValue(null);
      const controller = new LocationController(mockService());
      const res = makeRes();
      controller.remove(fakeReq({ params: { id: '5' } }), res, () => { });
      expect(res._status).toBe(401);
    });

    it('calls next with the error when service throws (e.g. 404)', () => {
      const notFound = Object.assign(new Error('not found'), { status: 404 });
      const controller = new LocationController(
        mockService({ deleteLocation: () => { throw notFound; } })
      );
      let caught;
      controller.remove(fakeReq({ params: { id: '99' } }), makeRes(), (err) => { caught = err; });
      expect(caught).toBe(notFound);
      expect(caught.status).toBe(404);
    });
  });
});
