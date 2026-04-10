<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
import GoogleMap from './components/GoogleMap.vue';
import OtherMap from './components/OtherMap.vue';
import LocationList from './components/LocationList.vue';

const showGoogleMap = import.meta.env.VITE_SHOW_GOOGLE_MAP !== 'false';
const { isAuthenticated, isLoading, user, loginWithRedirect, logout } = useAuth0();
const origin = window.location.origin;
</script>

<template>
  <div style="max-width: 1400px; margin: 0 auto; padding: 24px;">
    <!-- Header -->
    <header style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
      <h1 style="margin: 0;">VPV Demo Map</h1>
      <div style="display: flex; align-items: center; gap: 12px;">
        <template v-if="isLoading">
          <span style="color: #888;">Loading…</span>
        </template>
        <template v-else-if="isAuthenticated">
          <img v-if="user?.picture" :src="user.picture" :alt="user.name"
            style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;" />
          <span style="font-size: 14px; color: #444;">{{ user?.name ?? user?.email }}</span>
          <button
            style="padding: 6px 16px; border-radius: 6px; border: 1px solid #ccc; cursor: pointer; background: #fff;"
            @click="logout({ logoutParams: { returnTo: origin } })">
            Log out
          </button>
        </template>
        <template v-else>
          <button
            style="padding: 6px 16px; border-radius: 6px; border: none; cursor: pointer; background: #3b5bdb; color: #fff; font-weight: 600;"
            @click="loginWithRedirect()">
            Log in
          </button>
        </template>
      </div>
    </header>

    <!-- Unauthenticated splash -->
    <div v-if="!isLoading && !isAuthenticated"
      style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 400px; gap: 16px; color: #555;">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" stroke-width="1.5">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
      <p style="font-size: 18px; font-weight: 600;">Please log in to use the map</p>
      <button
        style="padding: 10px 28px; border-radius: 6px; border: none; cursor: pointer; background: #3b5bdb; color: #fff; font-size: 16px; font-weight: 600;"
        @click="loginWithRedirect()">
        Log in with Auth0
      </button>
    </div>

    <!-- Authenticated app -->
    <section v-else-if="isAuthenticated" style="display: flex; gap: 24px; align-items: flex-start;">
      <div id="mapContainer" style="flex: 1.5; min-width: 0;">
        <GoogleMap v-if="showGoogleMap" />
        <OtherMap v-else />
      </div>
      <div id="locationListContainer"
        style="flex: 1; min-width: 280px; max-height: 600px; overflow-y: auto; border-radius: 8px;">
        <LocationList />
      </div>
    </section>
  </div>
</template>
