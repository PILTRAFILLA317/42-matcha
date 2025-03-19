<script lang="ts">
	import type { PageServerData } from '../$types';
	import SearchIcon from '/src/assets/search.svg';
	import DoubleSlider from '../../lib/components/DoubleSlider.svelte';
	import SearchedUserCard from '../../lib/components/SearchedUserCard.svelte';
	import { onMount } from 'svelte';

	let { data }: { data: PageServerData } = $props();

	let registeredUser = data.user;

	let minAge = $state(18);
	let maxAge = $state(65);

	let minFR = $state(0);
	let maxFR = $state(1000);

	let Distance = $state(40);

	let clickedTags = $state([]);

	let userAmount = 10;

	let tag = $state({
		id: '',
		preference: '',
		clicked: false
	});

	let tags = $state([tag]);
	let isLoading = $state(false);

	let searchedUsersData = $state([]);
	let searchedUsers = $state([]);

	async function getUsersByDistance() {
		isLoading = true;
		try {
			const res = await fetch('../api/get-users-by-distance', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userAmount: userAmount
				})
			});
			const usersData = await res.json();

			if (res.ok) {
				isLoading = false;

				searchedUsersData = usersData;
				await scrollToSearchedUsers();
			} else {
				isLoading = false;

				console.log('Error al obtener los usuarios.');
			}
		} catch (err) {
			isLoading = false;

			console.log('Error al obtener los usuarios.');
		}
		isLoading = false;
	}

	async function getUsersByAge() {
		isLoading = true;
		try {
			const res = await fetch('../api/get-users-by-age', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userAmount: userAmount
				})
			});
			const usersData = await res.json();

			if (res.ok) {
				isLoading = false;

				searchedUsersData = usersData;
				await scrollToSearchedUsers();
			} else {
				isLoading = false;

				console.log('Error al obtener los usuarios.');
			}
		} catch (err) {
			isLoading = false;

			console.log('Error al obtener los usuarios.');
		}
		isLoading = false;
	}

	async function getUsersByRating() {
		isLoading = true;
		try {
			const res = await fetch('../api/get-users-by-rating', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userAmount: userAmount
				})
			});
			const usersData = await res.json();

			if (res.ok) {
				isLoading = false;

				searchedUsersData = usersData;
				await scrollToSearchedUsers();
			} else {
				isLoading = false;

				console.log('Error al obtener los usuarios.');
			}
		} catch (err) {
			isLoading = false;

			console.log('Error al obtener los usuarios.');
		}
		isLoading = false;
	}

	async function scrollToSearchedUsers() {
		await new Promise((resolve) => setTimeout(resolve, 100));
		const searchedUsersDiv = document.getElementById('searchedUsers');
		if (searchedUsersDiv) {
			searchedUsersDiv.scrollIntoView({ behavior: 'smooth' });
		}
	}

	async function getAllTags() {
		try {
			const res = await fetch('../api/get-tags');
			const data = await res.json();

			if (res.ok) {
				tags = data;
			} else {
				console.log('Error al obtener los tags.');
			}
		} catch (err) {
			console.log('Error al obtener los tags.');
		}
	}

	let sortOption = $state('');

	async function sortUsers() {
		userAmount = 10;
		console.log(sortOption);
		if (sortOption === 'distance') {
			getUsersByDistance();
		} else if (sortOption === 'rating') {
			getUsersByRating();
		} else if (sortOption === 'age') {
			getUsersByAge();
		}
	}

	async function handleLoadMore() {
		userAmount += 10;
		console.log(userAmount);
		if (sortOption === 'distance') {
			getUsersByDistance();
		} else if (sortOption === 'rating') {
			getUsersByRating();
		} else if (sortOption === 'age') {
			getUsersByAge();
		}
	}

	onMount(() => {
		getAllTags();
	});
</script>

<div class="flex flex-col items-center justify-center gap-4">
	<div class="flex flex-row items-center gap-4">
		<img src={SearchIcon} alt="Search Icon" class="h-10 w-10" />
		<h1 class="text-4xl font-bold">Search</h1>
	</div>
	<div
		class="flex w-full flex-col items-center gap-1 rounded-2xl bg-white px-5 text-black md:flex-row"
	>
		<label for="sort" class="m-2 md:m-5 w-auto text-black">Sort by:</label>
		<form class="filter">
			<div>
				<div class="flex flex-col items-center m-2 gap-2 md:flex-row">
					{#if sortOption === ''}{:else}
						<input class="btn btn-square" type="reset" value="x" />
					{/if}
					<input
						class="btn"
						type="radio"
						name="frameworks"
						aria-label="📍 Distance"
						bind:group={sortOption}
						value="distance"
						onchange={sortUsers}
					/>
					<input
						class="btn"
						type="radio"
						name="frameworks"
						aria-label="🔥 Rating"
						bind:group={sortOption}
						value="rating"
						onchange={sortUsers}
					/>
					<input
						class="btn"
						type="radio"
						name="frameworks"
						aria-label="🔞 Age"
						bind:group={sortOption}
						value="age"
						onchange={sortUsers}
					/>
				</div>
			</div>
		</form>
	</div>
	<div class="flex flex-col items-center justify-center gap-10">
		<div id="searchedUsers" class="grid md:grid-cols-4 grid-cols-1 items-start justify-between gap-10">
			{#each searchedUsersData as user}
				<SearchedUserCard {user} {registeredUser} />
			{/each}
		</div>
	</div>
	{#if sortOption === ''}{:else if isLoading}
		<span class="loading loading-spinner loading-lg"></span>
	{:else}
		<button class="btn btn-primary" onclick={handleLoadMore}>Load More</button>
	{/if}
</div>
