import { createStore } from 'vuex';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export default createStore({
  state: {
    locations: [],
    selectedLocation: null,
  },

  mutations: {
    SET_LOCATIONS(state, locations) {
      state.locations = locations;
    },
    ADD_LOCATION(state, location) {
      state.locations.unshift(location);
    },
    SET_SELECTED(state, location) {
      state.selectedLocation = location;
    },
    DELETE_LOCATION(state, locationId) {
      state.locations = state.locations.filter(loc => loc.id !== locationId);
    },
    VIEW_LOCATION(state, locationId) {
      state.selectedLocation = state.locations.find(loc => loc.id === locationId) || null;
    },
  },

  actions: {
    // token is obtained by the calling component via useAuth0() and passed in
    async fetchLocations({ commit }, { token }) {
      const { data } = await axios.get(`${API_BASE}/api/locations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      commit('SET_LOCATIONS', data);
    },

    async saveLocation({ commit }, { token, ...location }) {
      const { data } = await axios.post(`${API_BASE}/api/locations`, location, {
        headers: { Authorization: `Bearer ${token}` },
      });
      commit('ADD_LOCATION', data);
      commit('SET_SELECTED', null);
    },

    async deleteLocation({ commit }, { token, locationId }) {
      await axios.delete(`${API_BASE}/api/locations/${locationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      commit('DELETE_LOCATION', locationId);
    },

    viewLocation({ commit }, { locationId }) {
      commit('VIEW_LOCATION', locationId);
    },
  },

  getters: {
    locations: (state) => state.locations,
    selectedLocation: (state) => state.selectedLocation,
  },
});
