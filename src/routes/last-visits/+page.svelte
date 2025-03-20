<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	type visitedUser = {
		username: string;
		image: string;
	};

	let isLoading = $state(true);

	let { data }: { data: PageData } = $props();
	let lastVisits: visitedUser[] = $state([]);

	async function getLastVisits() {
		const res = await fetch('/api/last-visits', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ userId: data.user.userId })
		});
		const resData = await res.json();
		for (const visit of resData) {
			lastVisits.push({
				username: visit.username,
				image: visit.profilePicture
			});
		}
		lastVisits.reverse();
	}

	onMount(async () => {
		isLoading = true;
		await getLastVisits();
		isLoading = false;
	});
</script>

{#if isLoading}
	<div class="flex flex-col items-center gap-5">
		<div class="flex flex-row items-center gap-2">
			<h1 class="text-2xl font-bold">Last 10 Visits</h1>
		</div>
		<span class="loading loading-xl loading-spinner text-primary"></span>
	</div>
{:else}
	<div class="flex flex-col items-center gap-5">
		<div class="flex flex-row items-center gap-2">
			<h1 class="text-2xl font-bold">Last 10 Visits</h1>
		</div>
		<div>
			{#if lastVisits.length > 0}
				<ul>
					{#if lastVisits.length > 5}
						<div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
							{#each lastVisits as visit}
								<button
									type="button"
									class="card bg-base-200 mx-auto mt-5 flex w-full flex-row items-center gap-10 p-4 px-12 shadow-xl"
									onclick={() => (window.location.href = `/users/${visit.username}`)}
									aria-label={`Visit profile of ${visit.username}`}
								>
									<img
										alt=""
										src={visit.image ||
											'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'}
										class="h-12 w-12 rounded-full"
									/>
									<h1 class="text-xl">{visit.username}</h1>
								</button>
							{/each}
						</div>
					{:else}
						{#each lastVisits as visit}
							<button
								type="button"
								class="card bg-base-200 mx-auto mt-5 flex w-full flex-row items-center gap-10 p-4 px-12 shadow-xl"
								onclick={() => (window.location.href = `/users/${visit.username}`)}
								aria-label={`Visit profile of ${visit.username}`}
							>
								<img
									alt=""
									src={visit.image ||
										'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'}
									class="h-12 w-12 rounded-full"
								/>
								<h1 class="text-xl">{visit.username}</h1>
							</button>
						{/each}
					{/if}
				</ul>
			{:else}
				<p>No visits found.</p>
			{/if}
		</div>
	</div>
{/if}
