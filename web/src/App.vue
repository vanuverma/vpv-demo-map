<script setup>
import GoogleMap from './components/GoogleMap.vue';
import OtherMap from './components/OtherMap.vue';
import LocationList from './components/LocationList.vue';

const showGoogleMap = import.meta.env.VITE_SHOW_GOOGLE_MAP !== 'false';
</script>

<template>
  <div style="max-width: 960px; margin: 0 auto; padding: 24px;">
    <h1 style="margin-bottom: 16px;">VPV Demo Map</h1>
    <GoogleMap v-if="showGoogleMap" />
    <OtherMap v-else />
    <LocationList />
  </div>
</template>
