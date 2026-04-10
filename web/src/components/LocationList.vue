<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useAuth0 } from '@auth0/auth0-vue';

const store = useStore();
const { getAccessTokenSilently } = useAuth0();
const locations = computed(() => store.getters.locations);

onMounted(async () => {
  const token = await getAccessTokenSilently();
  if (!token) {
    alert('Unable to get access token. Please try again.');
    return;
  }
  store.dispatch('fetchLocations', { token });
});

async function deleteLocation(locationId) {
  if (!locationId) {
    alert('Location ID is missing. Cannot delete this location.');
    return;
  }
  const token = await getAccessTokenSilently();
  if (!token) {
    alert('Unable to get access token. Please try again.');
    return;
  }
  store.dispatch('deleteLocation', { token, locationId });
}

async function viewLocation(locationId) {
  if (!locationId) {
    alert('Location ID is missing. Cannot view this location.');
    return;
  }
  store.dispatch('viewLocation', { locationId });
}

</script>

<template>
  <div style="margin-top: 24px;">
    <h3>Saved Locations</h3>
    <p v-if="!locations.length" style="margin-top: 8px; color: #777;">No locations saved yet.</p>
    <table v-else style="width: 100%; border-collapse: collapse; margin-top: 8px; overflow: auto; border: 1px solid gray;">
      <thead>
        <tr>
          <th style="text-align: left; padding: 6px; border-bottom: 1px solid #ccc;">#</th>
          <th style="text-align: left; padding: 6px; border-bottom: 1px solid #ccc;">Address</th>
          <th style="text-align: left; padding: 6px; border-bottom: 1px solid #ccc;">Lat</th>
          <th style="text-align: left; padding: 6px; border-bottom: 1px solid #ccc;">Lng</th>
          <th style="text-align: left; padding: 6px; border-bottom: 1px solid #ccc;">Saved at</th>
          <th style="text-align: left; padding: 6px; border-bottom: 1px solid #ccc;">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(loc, i) in locations" :key="loc.id ?? i">
          <td style="padding: 6px;">{{ i + 1 }}</td>
          <td style="padding: 6px;">{{ loc.address }}</td>
          <td style="padding: 6px;">{{ loc.lat.toFixed(5) }}</td>
          <td style="padding: 6px;">{{ loc.lng.toFixed(5) }}</td>
          <td style="padding: 6px;">{{ loc.created_at ?? '—' }}</td>
          <td style="padding: 6px;">
            <button style="height: 30px; width: 60px; background-color: lightgreen; font-weight: bold;" @click="viewLocation(loc.id)">View</button>
            <button style="height: 30px; width: 60px; background-color: lightcoral; font-weight: bold;" @click="deleteLocation(loc.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
