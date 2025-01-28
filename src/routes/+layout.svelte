<script lang="ts">
	import '../app.css';
	import type { LayoutServerData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	let { children, data }: { children: any; data: LayoutServerData } = $props();
	import { locationStore } from '$lib/stores/location';

	// Obtener ubicación al cargar la página
	async function getLocation() {
		if (data.user?.location){
			return;
		}

		console.log('Obteniendo ubicación...');
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
						console.log('Actualizando ubicación en la base de datos...');
						updateLocation(location);
					}
					// locationStore.set(location);
					// localStorage.setItem('user-location', JSON.stringify(location)); // Guarda en localStorage
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

	// Respaldo: Ubicación por IP
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
				// locationStore.set(location);
				// localStorage.setItem('user-location', JSON.stringify(location)); // Guarda en localStorage
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
			console.log('Body:', body);
			const res = await fetch('../api/location-update', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body
			});
			const data = await res.json();

			if (res.ok) {
				// const location = {
				//   latitude: data.latitude,
				//   longitude: data.longitude,
				//   city: data.city,
				//   country: data.country,
				//   error: null
				// };
				// locationStore.set(location);
				// localStorage.setItem('user-location', JSON.stringify(location)); // Guarda en localStorage
				console.log('Ubicación actualizada en la base de datos.');
			}
		} catch (err) {
			console.log('RES:', data);
			console.log('Error al actualizar la ubicación en la base de datos.');
		}
	}

	// Ejecutar la lógica al cargar la página
	onMount(() => {
		getLocation();
	});
</script>

<nav class="flex items-center bg-transparent p-5 text-white">
	<!-- <a href="/" class="justify-end text-xl">MatchPoint</a> -->
	<a href="/">
		<img src="/src/assets/logo.png" alt="MatchPoint" class="h-16 w-auto" />
		<text class="text-xl font-bold">{$locationStore.latitude}</text>
		<text class="text-xl font-bold">{$locationStore.longitude}</text>
	</a>
	{#if !data.user?.userId}
		<a class="relative ml-auto" href="/auth/login">Login</a>
	{/if}
	{#if data.user?.userId}
		<div class="avatar dropdown dropdown-hover dropdown-end relative ml-auto w-12 cursor-pointer">
			<img
				class="rounded-xl"
				src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
				alt="User avatar"
			/>
			<ul class="menu dropdown-content rounded-box bg-base-100 z-1 w-52 p-2 shadow-sm">
				<li><a href={`/users/${data.user.username}`} class="block h-full w-full">Profile</a></li>
				<li><a href="/settings" class="block h-full w-full">Settings</a></li>
				<li>
					<a href="/logout" class="block h-full w-full" onclick={() => invalidateAll()}>Log Out</a>
				</li>
			</ul>
		</div>
	{/if}
</nav>

<main class="flex min-h-[calc(100vh-5rem-5rem)] flex-1 items-center justify-center">
	{@render children()}
</main>

<footer class=" w-full bg-slate-700 p-4 text-center text-white">
	<p>© 2025 - MatchPoint - Todos los derechos reservados</p>
</footer>
