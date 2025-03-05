<script lang="ts">
	import { enhance } from '$app/forms';
	import ChatMessage from '$lib/components/chat/ChatMessage.svelte';
	import MiniProfile from '$lib/components/chat/MiniProfile.svelte';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	// let selectedUser = $state(data.matchList);

	let chatMessages: Array<Messages> = $state([]);
	let activeChat: string | null = $state(null);
	$effect(async ()=> {
		if (activeChat) {
			try{
				const res = await fetch(`../api/messages?user=${activeChat}`, {				method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					},
				});
				const response = await res.json();
				chatMessages = response.body;
			} catch (e) {
				console.log(e);
			}
		}
	});
</script>

<div class="x-auto bg-primary m-5 h-[80vh] w-full rounded-lg p-2 shadow-md">
	<div class="flex items-start justify-between">
		<h1 class="start pb-2 text-6xl font-bold text-white">Chats</h1>
		<a class="end pb-2 text-6xl font-bold text-white" href="localhost:5173/users/{activeChat}"
			>{activeChat ?? ''}</a
		>
	</div>
	<div class="flex h-[90%] space-x-2">
		<!-- CUIDANGE CON EL OVERFLOW AUTO -->
		<div class="w-1/6 space-y-2 overflow-auto">
			{#each Object.entries(data.matchList) as [username, pictures]}
				<!-- svelte-ignore attribute_quoted -->
				<MiniProfile
					onclick={() => {
						activeChat = username;
					}}
					{username}
					{pictures}
				/>
			{/each}
		</div>
		<div
			class="relative h-full w-5/6 flex-col justify-between rounded-lg bg-[url(https://i.kym-cdn.com/entries/icons/original/000/038/667/tco_-_2021-10-25T163043.660.jpg)] bg-cover"
		>
			{#if activeChat}
				<div class="relative flex h-[93%] flex-col-reverse overflow-auto">
					{#each chatMessages as message}
						<ChatMessage user={data.user} username={message.sender} message={message.content} />
					{/each}
				</div>
				<div class="h-[7%]">
					<!-- svelte-ignore event_directive_deprecated -->
					<form method="POST" use:enhance class="relative flex h-full items-center">
						<input type="hidden" name="selectedUser" value={activeChat} />
						<input
							autocomplete="off"
							name="message"
							maxlength="1000"
							minlength="1"
							type="text"
							class="inputmessage bg-base-200 h-[100%] w-full rounded-lg text-white"
							placeholder="Type a message..."
						/>
						<button
							type="submit"
							formaction={'?/sendMessage'}
							class="bg-secondary !absolute right-1 h-[90%] w-[15%] rounded-xl text-white"
						>
							Send
						</button>
					</form>
				</div>
			{/if}
		</div>
	</div>
	<!-- <MiniProfile user={data.user} /> -->
</div>
