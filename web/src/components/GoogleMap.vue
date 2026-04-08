<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';

const store = useStore();

setOptions({ key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY });

const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';
const defaultCenter = { lat: -33.856, lng: 151.215 }; // Sydney

const selected = ref(null);
let activeMarker = null;

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
    zoom: 12,
    mapTypeControl: false,
    mapId,
  });

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

    // // TODO: fix; Reverse geocode the clicked point
    // const result = await geocoder.geocode({ location: { lat, lng } });
    const address = null;// result.results[0]?.formatted_address ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

    selected.value = { address, lat, lng };
    store.commit('SET_SELECTED', selected.value);
  });
}

function saveLocation() {
  if (!selected.value) return;
  store.dispatch('saveLocation', selected.value);
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
