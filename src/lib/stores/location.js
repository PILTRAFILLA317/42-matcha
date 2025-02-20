// src/lib/stores/location.js
import { writable } from 'svelte/store';

export const locationStore = writable({
  latitude: null,
  longitude: null,
  city: null,
  country: null,
  error: null
});

export * from './notifications.svelte';