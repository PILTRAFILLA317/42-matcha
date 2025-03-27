<script lang="ts">
	import { enhance } from '$app/forms';

	let query: { name: string; lat: number; long: number }= $state({name: '', lat: 0, long: 0});
	let suggestions: { name: string; lat: number; long: number }[] = $state([]);

	let debounceTimer: NodeJS.Timeout;

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
			const res = await fetch(
				`https://api.geoapify.com/v1/geocode/autocomplete?text=${query.name}&limit=5&lang=es&apiKey=7c0d89fa68514f02b25b471e603916c6`
			);
			const responseData = await res.json();
			suggestions = responseData.features.map((place: { properties: { formatted: string; lat: number; lon: number } }) => ({
				name: place.properties.formatted,
				lat: place.properties.lat,
				long: place.properties.lon
			}));
		} catch (error) {
			console.error('Error fetching suggestions:', error);
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class="mx-auto flex h-[60vh] w-xl flex-col rounded-lg bg-sky-900 p-6 shadow-md">
	<h1 class="mb-4 text-center text-2xl font-semibold text-primary">Location Page</h1>
	
    <label for="query" class="block text-md font-medium text-primary">Type your location</label>
	
	<div class="relative w-full">
		<form use:enhance method="POST" class="flex">
			<input
				type="hidden"
				name="lat"
				bind:value={query.lat}
			/>
			<input
				type="hidden"
				name="long"
				bind:value={query.long}
			/>
			<input
				name="name"
				bind:value={query.name}
				onkeyup={handleInput}
				type="text"
				placeholder="Type a place..."
				autocomplete="off"
				class="input w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
			/>
			<button class="btn ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" formaction="?/changeLocation">
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
		<button class="btn bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700" formaction="?/activateLocation">
			Automatic Location
		</button>
	</form>
</div>
