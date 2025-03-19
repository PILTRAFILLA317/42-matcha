<script lang="ts">
	import type { PageData } from '../blocked-users/$types';
	import { onMount } from 'svelte';

	const { data } = $props();

	let registeredUser = data.user;

	let blockedUsers: { username: string; profilePicture?: string }[] = $state([]);

	async function unblockUser(currentUser: string) {
		const response = await fetch('/api/block-user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				blockedUserUsername: currentUser,
				userId: registeredUser.userId
			})
		});
		const result = await response.json();
		if (response.ok) {
			console.log('User unblocked successfully:', result);
			blockedUsers = blockedUsers.filter(user => user.username !== currentUser);
		} else {
			console.error('Error unblocking user:', result);
		}
	}

	async function getBlockedUsers() {
		try {
			const res = await fetch('/api/get-blocked-users');
			const data = await res.json();

			if (res.ok) {
				console.log('Blocked users fetched successfully:', data);
				blockedUsers = data.blockedUsers;
				return;
			} else {
				console.error('Error fetching blocked users.');
			}
		} catch (err) {
			console.error('Error fetching blocked users.');
		}
	}

	onMount(() => {
		getBlockedUsers();
	});
</script>

<div>
	<h1 class="text-center text-2xl font-bold">Blocked Users</h1>
	<p class="text-center text-gray-600">List of users you have blocked.</p>

	<div class="mt-4 items-end">
		{#if blockedUsers.length > 0}
				{#each blockedUsers as user}
					<div class="p-4 bg-gray-800 rounded-lg shadow-md mb-4">
						<div class="flex items-center justify-between">
							{#if user.profilePicture}
								<img src={user.profilePicture} alt="User Profile" class="h-10 w-10 rounded-full" />
							{:else}
								<img src="https://static.thenounproject.com/png/4530368-200.png" alt="Default Profile" class="h-10 w-10 rounded-full" />
							{/if}
							<div class="ml-3 mr-9">
								<a href={`/users/${user.username}`} class="font-semibold text-blue-500 hover:underline">{user.username}</a>
							</div>
							<button
								class="ml-auto rounded bg-red-500 px-4 py-2 text-white"
								onclick={() => unblockUser(user.username)}
							>
								Unblock
							</button>
						</div>
					</div>
				{/each}
		{:else}
			<p class="text-center text-gray-500">No blocked users found.</p>
		{/if}
	</div>
</div>
