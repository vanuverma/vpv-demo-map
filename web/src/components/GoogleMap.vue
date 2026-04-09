<script setup>
import { ref, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useAuth0 } from '@auth0/auth0-vue';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';

const store = useStore();
const { getAccessTokenSilently } = useAuth0();

setOptions({ key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY });

const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';
const defaultCenter = { lat: -33.856, lng: 151.215 }; // Sydney
const defaultZoomLevel = 12;

const selected = ref(null);
let activeMarker = null;   // marker for a newly clicked (unsaved) point
let viewedMarker = null;   // marker for a location viewed from the list
let mapInstance = null;    // reference to the Map object for panning

async function initMap() {
  const [{ Map }, { AdvancedMarkerElement }, { Geocoder }] = await Promise.all([
    importLibrary('maps'),
    importLibrary('marker'),
    importLibrary('geocoding'),
  ]);

  const mapDiv = document.getElementById('gmap');
  const geocoder = new Geocoder();

  const map = new Map(mapDiv, {
    center: defaultCenter,
    zoom: defaultZoomLevel,
    mapTypeId: 'roadmap',
    mapTypeControl: false,
    mapId,
  });

  mapInstance = map;

  // Watch the store's selectedLocation — set by the View button in LocationList
  watch(
    () => store.getters.selectedLocation,
    (location) => {
      if (!location?.lat || !location?.lng) return;
      const pos = { lat: location.lat, lng: location.lng };

      // Remove previous viewed marker
      if (viewedMarker) {
        viewedMarker.map = null;
        viewedMarker = null;
      }

      viewedMarker = new AdvancedMarkerElement({ map, position: pos });
      map.panTo(pos);
      map.setZoom(defaultZoomLevel);
    }
  );

  map.addListener('click', async (event) => {
    if (!event.latLng) return;
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    // Remove previous marker
    if (activeMarker) {
      activeMarker.map = null;
    }
    activeMarker = new AdvancedMarkerElement({
      map,
      position: { lat, lng }
    });

    // Reverse geocode the clicked point
    let address;
    try {
      const result = await geocoder.geocode({ location: { lat, lng } });
      address = result.results[0]?.formatted_address ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    } catch (error) {
      console.error('Geocoding error:', error);
      address = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }

    selected.value = { address, lat, lng };
    store.commit('SET_SELECTED', selected.value);
  });
}

async function saveLocation() {
  if (!selected.value) {
    alert('No location selected. Please click on the map to select a location first.');
    return;
  }
  const token = await getAccessTokenSilently();
  if (!token) {
    alert('Unable to get access token. Please try again.');
    return;
  }
  store.dispatch('saveLocation', { token, ...selected.value });
  selected.value = null;
  if (activeMarker) { activeMarker.map = null; activeMarker = null; }
}

onMounted(initMap);
</script>

<template>
  <div>
    <div id="gmap" style="width: 100%; height: 600px;"></div>
    <div v-if="selected" style="margin-top: 10px;">
      <span>{{ selected.address }}</span>
      <button style="margin-left: 12px; height: 50px; width: 100px; background-color: lightblue; font-weight: bold;" @click="saveLocation">Save Location</button>
    </div>
  </div>
</template>
