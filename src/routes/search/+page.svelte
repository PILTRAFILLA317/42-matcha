<script lang="ts">
	import type { PageServerData } from '../$types';
	import SearchIcon from '/assets/search.svg';
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

	let tag = $state({
		id: '',
		preference: '',
		clicked: false
	});

	let tags = $state([tag]);
	let isLoading = $state(false);

	let searchedUsersData = $state([]);
	let searchedUsers = $state([]);

	async function getSearchedUsers() {
		isLoading = true;
		try {
			const res = await fetch('../api/user-research', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					minAge: minAge,
					maxAge: maxAge,
					minFR: minFR,
					maxFR: maxFR,
					distance: Distance,
					tags: clickedTags,
					currentUser: registeredUser
				})
			});
			const researchData = await res.json();

			if (res.ok) {
				isLoading = false;

				searchedUsersData = researchData;
				await scrollToSearchedUsers();
			} else {
				isLoading = false;
			}
		} catch (err) {
			isLoading = false;
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

	function handleTagClick(tag) {
		if (tag.clicked) {
			clickedTags = clickedTags.filter((clickedTag) => clickedTag !== tag.preference);
		} else {
			clickedTags = [...clickedTags, tag.preference];
		}
		tag.clicked = !tag.clicked;
	}

	async function getAllTags() {
		try {
			const res = await fetch('../api/get-tags');
			const data = await res.json();

			if (res.ok) {
				tags = data;
			} else {
			}
		} catch (err) {}
	}

	onMount(() => {
		getAllTags();
	});
</script>

<div class="flex flex-col items-center justify-center gap-10">
	<h1 class="text-3xl font-bold">¡Encuentra el amor de tu vida!</h1>
	<div class="flex w-full flex-col justify-between rounded-xl bg-gray-800 p-10 shadow-md">
		<div class="flex w-full flex-col justify-between lg:flex-row lg:items-center">
			<div>
				<div class="flex flex-col">
					<label for="range" class="mb-5 text-lg font-bold text-white">Distancia</label>
					<input
						type="range"
						min="0"
						max="99"
						bind:value={Distance}
						class="range range-accent w-full"
					/>
					<text class="text-lg text-white">{Distance}{Distance === 99 ? '+' : ''} km</text>
				</div>
				<div class="divider divider-neutral divider-vertical"></div>

				<div class="flex flex-col">
					<label for="ageRange" class="mb-5 text-lg font-bold text-white">Rango de Edad</label>
					<!-- <div> -->
					<div class="flex flex-col">
						<text class="text-lg text-white">Edad mínima: {minAge}</text>
						<text class="text-lg text-white">Edad maxima: {maxAge}</text>
					</div>
					<DoubleSlider
						bind:minValue={minAge}
						bind:maxValue={maxAge}
						min={18}
						max={99}
						class="mx-auto w-full lg:w-96"
					/>
				</div>
			</div>
			<div class="divider divider-neutral lg:divider-horizontal"></div>
			<div class="flex flex-col items-start justify-baseline lg:w-1/2">
				<label for="range" class="flex gap-3 text-lg font-bold text-white"
					>Fame Rating
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="220.0741 46.564 161.7344 209.9264"
						class="w-6"
					>
						<g />
						<g
							transform="matrix(11.55245590209961, 0, 0, 11.046404838562012, 162.3118438720703, 13.46955871582032)"
							style=""
						>
							<path
								d="M 12 22 C 10.1 22 8.4 21.3 7.1 19.9 C 5.7 18.6 5 16.9 5 15 C 5 13 5.9 10.7 7.3 9.3 L 7.4 9.2 C 8.6 8 10 6.5 10 4 C 10 3.6 10.2 3.2 10.6 3.1 C 11 2.9 11.4 3 11.7 3.3 C 12.9 4.5 15.182 7.364 13.782 10.664 C 13.982 10.664 14.1 11.3 15.2 9.5 C 15.3 9.2 15.6 9 15.9 9 C 16.2 9 16.5 9.1 16.7 9.3 C 17.8 10.5 19 13.1 19 15 C 19 16.9 18.3 18.6 16.9 19.9 C 15.6 21.3 13.9 22 12 22 Z"
								fill="#fd7e89"
								opacity="1"
								data-original="#000000"
								class=""
							/>
						</g>
					</svg>
				</label>
				<div class="mt-5 flex flex-col">
					<text class="text-lg text-white">Fame Rating mínimo: {minFR}</text>
					<text class="text-lg text-white">Fame Rating máximo: {maxFR}</text>
				</div>
				<DoubleSlider
					bind:minValue={minFR}
					bind:maxValue={maxFR}
					min={0}
					max={1000}
					class="w-full lg:w-96"
				/>
				<div class="divider divider-neutral divider-vertical" />
				<div class="flex flex-col gap-3">
					<text class="text-lg font-bold text-white">Gustos</text>
					<div class="flex max-w-lg flex-wrap gap-2">
						{#each tags as tag}
							<div class="flex items-center gap-2">
								<div
									class="badge badge-secondary h-8 w-auto cursor-pointer text-white {tag.clicked
										? ''
										: 'badge-outline'}"
									onclick={() => handleTagClick(tag)}
								>
									{tag.preference}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
		<div class="flex w-full flex-row items-center justify-end gap-4">
			<text class="text-lg font-bold text-white">¡Buscar!</text>
			<div class="">
				<button onclick={async () => await getSearchedUsers()} class="btn">
					<img src={SearchIcon} alt="Chat Icon" class="w-8" />
				</button>
			</div>
		</div>
	</div>
	<div class="flex w-full flex-col items-center justify-center">
		<span class={['loading loading-spinner text-accent h-36 w-36', !isLoading && 'hidden']}></span>
		<div
			id="searchedUsers"
			class="grid grid-cols-1 items-start justify-between gap-10 lg:grid-cols-4"
		>
			{#each searchedUsersData as user}
				<SearchedUserCard {user} {registeredUser} />
			{/each}
		</div>
	</div>
</div>
