<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	let { data }: { data: PageData } = $props();
	import NotificationIcon from '/src/assets/notifications.svg';

	type Notification = {
		message: string;
		type: string;
	};

	let clickedPage = $state(1);

	let notifications = $state<Notification[]>([]);

	let pagedNotifications = $state<Notification[][]>([]);

	function paginateNotifications() {
		const itemsPerPage = 7;
		const pages = Math.ceil(notifications.length / itemsPerPage);
		for (let i = 0; i < pages; i++) {
			pagedNotifications.push(notifications.slice(i * itemsPerPage, (i + 1) * itemsPerPage));
		}
	}

	function pageManager(page: number) {
		clickedPage = page;
	}

	async function setReadNotifications() {
		console.log('Obteniendo todas las notificaciones...');
		try {
			const res = await fetch(`/api/notifications/set-read?userId=${data.user?.userId}`);
			const resData = await res.json();

			if (res.ok) {
				notifications = resData;
				return resData;
			} else {
				console.error('Error al obtener las notificaciones.');
			}
		} catch (err) {
			console.error('Error al obtener las notificaciones.');
		}
	}

	onMount(async () => {
		await setReadNotifications();
		paginateNotifications();
	});
</script>

<div class="card bg-base-200 mx-auto mr-48 ml-48 w-full items-center gap-5 p-4 shadow-xl">
	<div class="flex flex-row items-center gap-2">
		<h1 class="text-2xl">Notificaciones</h1>
		<img src={NotificationIcon} alt="Notificaciones" class="h-8 w-8" />
	</div>
	{#if pagedNotifications.length > 0}
		<div class="mr-20 ml-20 flex w-full flex-col items-center gap-2 p-4">
			{#each pagedNotifications[clickedPage - 1] as notification}
				<div
					class="notification bg-base-100 flex w-full flex-row items-center gap-2 rounded-2xl p-4 shadow-xl"
				>
					<a href="/users/{notification.message}" class="link link-secondary"
						>{notification.message}</a
					>
					<p>
						{notification.type === 'visit'
							? 'ha visto tu perfil 👀'
							: notification.type === 'like'
								? 'te ha dado like 💖'
								: notification.type === 'match'
									? 'es un nuevo match 💘'
									: notification.type === 'unlike'
										? 'ha quitado el like 💔'
										: notification.type === 'chat'
											? 'te ha mandado un mensaje 💬'
											: ''}
					</p>
				</div>
			{/each}
		</div>
		<div class="join">
			{#each Array(pagedNotifications.length) as _, i}
				<button onclick={() => pageManager(i + 1)} class="join-item btn">{i + 1}</button>
			{/each}
		</div>
	{:else}
		<p>No hay notificaciones.</p>
	{/if}
</div>
