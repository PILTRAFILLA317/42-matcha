<script lang="ts">
	import { enhance } from '$app/forms';

	let query: { name: string; lat: number; long: number } = $state({ name: '', lat: 0, long: 0 });
	let suggestions: { name: string; lat: number; long: number }[] = $state([]);
	let { data }: { data: any } = $props();

	let debounceTimer: NodeJS.Timeout;

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
			}
		} catch (err) {}
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
			}
		} catch (err) {}
	}

	async function getLocation() {
		// if (data.user?.location) {
		// 	return;
		// }

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
			await getLocationByIP(); // Respaldo con IP
		}
	}

	function handleInput(event: Event) {
		clearTimeout(debounceTimer);

		debounceTimer = setTimeout(() => {
			fetchSuggestions(event);
		}, 300);
	}

	async function fetchSuggestions(event: Event) {
		if (query.name.length === 0) {
			suggestions = [];
			return;
		}
		try {
			const res = await fetch(`/api/manual_location?query=${encodeURIComponent(query.name)}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const responseData = await res.json();
			suggestions = responseData.map(
				(place: { properties: { formatted: string; lat: number; lon: number } }) => ({
					name: place.properties.formatted,
					lat: place.properties.lat,
					long: place.properties.lon
				})
			);
		} catch (error) {
			console.error('Error fetching suggestions:', error);
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class="mx-auto flex h-[60vh] w-xl flex-col rounded-lg bg-sky-900 p-6 shadow-md">
	<h1 class="text-primary mb-4 text-center text-2xl font-semibold">Location Page</h1>

	<label for="query" class="text-md text-primary block font-medium">Type your location</label>

	<div class="relative w-full">
		<form use:enhance method="POST" class="flex">
			<input type="hidden" name="lat" bind:value={query.lat} />
			<input type="hidden" name="long" bind:value={query.long} />
			<input
				name="name"
				bind:value={query.name}
				onkeyup={handleInput}
				type="text"
				placeholder="Type a place..."
				autocomplete="off"
				class="input w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
			/>
			<button
				class="btn ml-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
				formaction="?/changeLocation"
			>
				Change Location
			</button>
		</form>
		{#if suggestions.length > 0}
			<ul class="absolute z-50 mt-1 w-full rounded-lg border border-sky-500 bg-sky-600 shadow-lg">
				{#each suggestions as suggestion}
					<li
						onclick={() => {
							query = suggestion;
							suggestions = [];
						}}
						class="cursor-pointer rounded-lg px-4 py-2 hover:bg-sky-700"
					>
						{suggestion.name}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
	<form use:enhance method="POST" class="mt-4">
		<button
			class="btn rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
			formaction="?/activateLocation"
			onclick={getLocation}
		>
			Automatic Location
		</button>
	</form>
</div>
