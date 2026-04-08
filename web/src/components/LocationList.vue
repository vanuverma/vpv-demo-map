<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const locations = computed(() => store.getters.locations);

onMounted(() => store.dispatch('fetchLocations'));
</script>

<template>
  <div style="margin-top: 24px;">
    <h3>Saved Locations</h3>
    <p v-if="!locations.length" style="margin-top: 8px; color: #777;">No locations saved yet.</p>
    <table v-else style="width: 100%; border-collapse: collapse; margin-top: 8px;">
      <thead>
        <tr>
          <th style="text-align: left; padding: 6px; border-bottom: 1px solid #ccc;">#</th>
          <th style="text-align: left; padding: 6px; border-bottom: 1px solid #ccc;">Address</th>
          <th style="text-align: left; padding: 6px; border-bottom: 1px solid #ccc;">Lat</th>
          <th style="text-align: left; padding: 6px; border-bottom: 1px solid #ccc;">Lng</th>
          <th style="text-align: left; padding: 6px; border-bottom: 1px solid #ccc;">Saved at</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(loc, i) in locations" :key="loc.id ?? i">
          <td style="padding: 6px;">{{ i + 1 }}</td>
          <td style="padding: 6px;">{{ loc.address }}</td>
          <td style="padding: 6px;">{{ loc.lat.toFixed(5) }}</td>
          <td style="padding: 6px;">{{ loc.lng.toFixed(5) }}</td>
          <td style="padding: 6px;">{{ loc.created_at ?? '—' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
