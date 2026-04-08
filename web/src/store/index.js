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
  },

  actions: {
    async fetchLocations({ commit }) {
      const { data } = await axios.get(`${API_BASE}/api/locations`);
      commit('SET_LOCATIONS', data);
    },

    async saveLocation({ commit }, location) {
      const { data } = await axios.post(`${API_BASE}/api/locations`, location);
      commit('ADD_LOCATION', data);
      commit('SET_SELECTED', null);
    },
  },

  getters: {
    locations: (state) => state.locations,
    selectedLocation: (state) => state.selectedLocation,
  },
});
