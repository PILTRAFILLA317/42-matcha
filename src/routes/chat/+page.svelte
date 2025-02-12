<script lang="ts">
	import { enhance } from '$app/forms';
	import ChatMessage from '$lib/components/chat/ChatMessage.svelte';
	import MiniProfile from '$lib/components/chat/MiniProfile.svelte';

	import type { PageData, PageProps } from './$types';

	let { data }: { data: PageData } = $props();
	let selectedUser = $state(data.matchList);


	let activeChat: string | null = $state(null);
</script>

<div class="x-auto m-5 h-[80vh] w-full rounded-lg bg-secondary p-2 shadow-md">
	<div class="flex items-start justify-between">
		<h1 class="start pb-2 text-6xl font-bold text-white">Chats</h1>
		<a class="end pb-2 text-6xl font-bold text-white" href="localhost:5173/users/{activeChat}">{activeChat?? ""}</a>
	</div>
	<div class="flex h-[90%] space-x-2">
		<!-- CUIDANGE CON EL OVERFLOW AUTO -->
		<div class="w-1/6 space-y-2 overflow-auto">
			{#each data.matchList as username}
				<!-- svelte-ignore attribute_quoted -->
				<MiniProfile onclick="{()=>{activeChat = username}}" username={username} />
			{/each}
		</div>
		<div class="relative h-full w-5/6 flex-col justify-between rounded-lg bg-[url(https://i.kym-cdn.com/entries/icons/original/000/038/667/tco_-_2021-10-25T163043.660.jpg)] bg-cover">
		{#if activeChat}
			<div class="h-[93%] overflow-auto relative flex flex-col-reverse">
				<ChatMessage user={data.user} username="txoinas" message="te voy a matar" />
				<ChatMessage user={data.user} username="eljoako" message="que tal" />
				<ChatMessage user={data.user} username="eljoako" message="holiwi" />
			</div>
			<div class="h-[7%]">
				<form method="POST" use:enhance class="h-full items-center relative flex">
					<input type="hidden" name="selectedUser" value={selectedUser} />
					<input
					maxlength="1000"
					type="text"
					class="inputmessage h-[100%] w-full rounded-lg bg-base-200 text-white"
					placeholder="Type a message..."
					/>
					<button formaction={'?/sendMessage'} class="!absolute right-1 h-[90%] w-[15%] rounded-xl bg-secondary text-white">
						Send
					</button>
				</form>
			</div>
			{/if}
		</div>
	</div>
	<!-- <MiniProfile user={data.user} /> -->
</div>
