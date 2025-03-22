<script lang="ts">
	import { enhance } from '$app/forms';
	import ChatMessage from '$lib/components/chat/ChatMessage.svelte';
	import MiniProfile from '$lib/components/chat/MiniProfile.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	import type { PageData } from './$types';

	let allMatches: string[] = $state([]);

	let { data }: { data: PageData } = $props();
	// let selectedUser = $state(data.matchList);

	let chatMessages: Array<Messages> = $state([]);
	let activeChat: string | null = $state(null);
	let eventSource: EventSource;
	let reconnectAttempts = 0;

	import { notificationState } from '$lib/stores/notifications.svelte';
	import { redirect } from '@sveltejs/kit';

	let notifications = $derived(notificationState.AllNotifications);
	$effect(() => {
		// notifications;
		notifications.length;
		if (
			notificationState.getLastNotification()?.type === 'match' &&
			!allMatches.includes(notificationState.getLastNotification()?.message)
		) {
			// console.log("LENGHT:", notifications.length);
			allMatches.push(notificationState.getLastNotification()?.message);
			return;
		}
		if (
			notificationState.getLastNotification()?.type === 'unlike' &&
			allMatches.includes(notificationState.getLastNotification()?.message)
		) {
			allMatches = allMatches.filter((user) => user !== activeChat);
			activeChat = null;
			return;
		}
	});

	async function fetchWithRetry(url: string, options: RequestInit, retries = 3, delay = 1000): Promise<any> {
		for (let attempt = 0; attempt < retries; attempt++) {
			try {
				const response = await fetch(url, options);
				if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
				return await response.json();
			} catch (error) {
				if (attempt < retries - 1) {
					console.warn(`Retrying fetch (${attempt + 1}/${retries})...`);
					await new Promise((resolve) => setTimeout(resolve, delay));
				} else {
					console.error('Fetch failed after retries:', error);
					throw error;
				}
			}
		}
	}

	$effect(() => {
		if (activeChat) {
			(async () => {
				try {
					const res = await fetch(`../api/messages?user=${activeChat}`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json'
						}
					});
					const response = await res.json();
					// Asegúrate de que response.body sea un array antes de asignarlo
					chatMessages = Array.isArray(response.body) ? response.body : [];
					console.log('Mensajes obtenidos:', chatMessages);
				} catch (e) {
					console.error('Error al obtener mensajes:', e);
				}
			})();
		}
	});

	async function areMatched(chatUsername: string): Promise<boolean> {
		try {
			const response = await fetch('/api/match', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: chatUsername
				})
			});
			const result = await response.json();
			// Asegúrate de que el resultado sea un booleano
			return result?.matched === true;
		} catch (error) {
			console.error('Error en areMatched:', error);
			return false;
		}
	}

	async function startSSERequest() {
		try {
			if (eventSource) {
				eventSource.close();
			}
			eventSource = new EventSource(`/api/chat/stream`);
			if (!eventSource) {
				return;
			}
			eventSource.onmessage = (event) => {
				reconnectAttempts = 0;
				try {
					if (event.data == 'connected') {
						// console.log('✅ Conectado al servidor de eventos SSE');
						return;
					}
					const parsedData = JSON.parse(event.data);
					if (
						parsedData.sender[0].username === activeChat ||
						parsedData.receiver[0].username === activeChat
					) {
						// chatMessages.push({ sender: parsedData.sender[0].username, content: parsedData.content });
						if (!chatMessages) {
							chatMessages = [{ sender: parsedData.sender[0].username, content: parsedData.content }];
						} else {
						chatMessages = [
							{ sender: parsedData.sender[0].username, content: parsedData.content },
							...chatMessages
						];
						}
					}
				} catch (err) {
					// console.error('❌ Error al procesar el mensaje SSE:', err, event.data);
				}
			};

			eventSource.onerror = (error) => {
				// console.error('❌ ERROR1 en SSE:', error);
				eventSource.close();
				const delay = Math.min(1000 * 2 ** reconnectAttempts, 30000);
				reconnectAttempts++;
				setTimeout(startSSERequest, delay);
			};
		} catch (error) {
			// console.error('❌ ERROR2 en SSE:', error);
		}
	}

	onMount(() => {
		if (!data.user?.userId) {
			redirect(302, '/login');
		}
		allMatches = data.matchList;
		let link;
		page.subscribe(async ($page) => {
			link = $page.url.searchParams.get('user');
			if (link) {
				if (await areMatched(link)) activeChat = link;
				// else console.log('❌ No estás conectado con este usuario');
			}
		});
		startSSERequest();
	});
</script>

<div class="x-auto bg-primary m-5 h-[80vh] w-full rounded-lg p-2 shadow-md">
	<div class="flex items-start justify-between">
		<h1 class="start pb-2 md:text-6xl text-xl font-bold text-white">Chats</h1>
		<a class="end pb-2 md:text-6xl text-3xl font-bold text-white" href="/users/{activeChat}"
			>{activeChat ?? ''}</a
		>
	</div>
	<div class="flex h-[90%] space-x-2">
		<div class="w-2/6 md:w-1/6 space-y-2 overflow-y-auto overflow-x-hidden">
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
			class="relative h-full w-4/6 md:w-5/6 flex-col justify-between rounded-lg bg-[url(https://i.kym-cdn.com/entries/icons/original/000/038/667/tco_-_2021-10-25T163043.660.jpg)] bg-cover"
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
</div>
