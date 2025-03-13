<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	import { onMount } from 'svelte';

	async function getLocation() {
		// console.log('Obteniendo ubicación...');
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					const location = {
						latitude: pos.coords.latitude,
						longitude: pos.coords.longitude,
						city: null, // Puedes obtenerla con IP o APIs adicionales
						country: null,
						error: null
					};
					if (data.user?.username) {
						// console.log('Actualizando ubicación en la base de datos...');
						updateLocation(location);
					}
				},
				async () => {
					await getLocationByIP(); // Respaldo con IP
				}
			);
		} else {
			console.log('Geolocation is not supported by this browser.');
			await getLocationByIP(); // Respaldo con IP
		}
	}

	async function getLocationByIP() {
		try {
			const res = await fetch('../api/ip-location');
			const data = await res.json();

			if (res.ok) {
				const location = {
					latitude: data.latitude,
					longitude: data.longitude,
					city: data.city,
					country: data.country,
					error: null
				};
				updateLocation(location);
			} else {
				console.log('Error al obtener la ubicación por IP.');
			}
		} catch (err) {
			console.log('Error al obtener la ubicación por IP.');
		}
	}

	async function updateLocation(location: { latitude: number; longitude: number }) {
		try {
			const body = JSON.stringify({
				latitude: location.latitude,
				longitude: location.longitude
			});
			// console.log('Body:', body);
			const res = await fetch('../api/location-update', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body
			});
			const data = await res.json();
			if (res.ok) {
				// console.log('Ubicación actualizada en la base de datos.');
			}
		} catch (err) {
			console.log('RES:', data);
			console.log('Error al actualizar la ubicación en la base de datos.');
		}
	}

	onMount(() => {
		if (data.user?.userId) {
			// console.log('Obteniendo ubicación...');
			getLocation();
		}
	});
</script>

<div class="flex flex-col items-center justify-center gap-7">
	<h1 class="text-4xl font-bold">Welcome {data.user.username}!</h1>
	<p class="mt-4 text-lg">This is the main page.</p>

	<div class="flex flex-row items-center gap-8">
		<button
			class="btn btn-xs sm:btn-sm btn-primary md:btn-md lg:btn-lg xl:btn-xl"
			onclick={() => (window.location.href = '/discover')}>Descubrir</button
		>
		<button
			class="btn btn-xs sm:btn-sm btn-primary md:btn-md lg:btn-lg xl:btn-xl"
			onclick={() => (window.location.href = '/search')}>Buscar</button
		>
		<button
			class="btn btn-xs sm:btn-sm btn-primary md:btn-md lg:btn-lg xl:btn-xl"
			onclick={() => (window.location.href = '/chat')}>Chat</button
		>
	</div>
</div>
