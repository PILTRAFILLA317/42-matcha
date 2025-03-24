<script lang="ts">
	import '../app.css';
	import type { LayoutServerData } from './$types';
	import { goto, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	let { children, data }: { children: any; data: LayoutServerData } = $props();
	import { locationStore } from '$lib/stores/location';
	import NotificationIcon from '/assets/notifications.svg';
	import { notificationState } from '$lib/stores/notifications.svelte';
	
	let eventSource: EventSource;
	let reconnectAttempts = 0;

	type NotificationType = {
		message: string;
		type: string;
	};

	let notifications = $state<NotificationType[]>([]);
	let notificationsOn = $state(false);

	async function getUnreadNotifications() {
		try {
			const res = await fetch(`/api/notifications/get-unread?userId=${data.user?.userId}`);
			const resData = await res.json();

			if (res.ok) {
				// notificationState.setAll(resData);
				for (let i = 0; i < resData.length; i++) {
					notificationState.addNotification({ message: resData[i].message, type: resData[i].type });
				}
				notifications = resData;
				if (resData.length > 0) {
					notificationsOn = true;
				}
				return resData;
			} else {
			}
		} catch (err) {
		}
	}

	// Obtener ubicación al cargar la página
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
					// locationStore.set(location);
					// localStorage.setItem('user-location', JSON.stringify(location)); // Guarda en localStorage
				},
				async () => {
					await getLocationByIP(); // Respaldo con IP
				}
			);
		} else {
			await getLocationByIP(); // Respaldo con IP
		}
	}

	async function setReadNotifications() {
		try {
			const res = await fetch(`/api/notifications/set-read?userId=${data.user?.userId}`);
			// const resData = await res.json();

			if (res.ok) {
				// notifications = resData;
				return;
			} else {
			}
		} catch (err) {
		}
	}

	async function redirectToNotifications() {
		notificationsOn = false;
		notificationState.removeAll();
		await setReadNotifications();
		window.location.href = '/notifications';
	}

	// Respaldo: Ubicación por IP
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
		} catch (err) {
		}
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
				// const location = {
				//   latitude: data.latitude,
				//   longitude: data.longitude,
				//   city: data.city,
				//   country: data.country,
				//   error: null
				// };
				// locationStore.set(location);
				// localStorage.setItem('user-location', JSON.stringify(location)); // Guarda en localStorage
				// console.log('Ubicación actualizada en la base de datos.');
			}
		} catch (err) {
		}
	}

	function parseNotification(jsonString: string) {
		try {
			const data = JSON.parse(jsonString);

			if (typeof data.message !== 'string' || typeof data.type !== 'string') {
				throw new Error('Formato inválido de notificación');
			}

			return {
				message: data.message,
				type: data.type
			};
		} catch (error) {
			return null;
		}
	}

	async function startSSERequest() {
		try {
			if (eventSource) {
				eventSource.close();
			}
			eventSource = new EventSource(`/api/notifications/stream`);
			if (!eventSource) {
				return;
			}
			eventSource.onmessage = (event) => {
				reconnectAttempts = 0;
				try {
					if (event.data == 'connected') {
						return;
					}
					const parsedData = JSON.parse(event.data);
					const parse = parseNotification(parsedData);
					const notification: NotificationType = {
						message: parse?.message,
						type: parse?.type
					};
					notificationState.addNotification(notification);
					notifications = notificationState.getNotifications();
					notificationsOn = true;
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
		return undefined;
	}

	onMount(async () => {
		if (data.user) {
			if (!data.user.completed){
				goto('/complete-profile');
			}
			getUnreadNotifications();
			getUnreadNotifications();
			getLocation();
			await startSSERequest();
			return () => {
				eventSource?.close();
				reconnectAttempts = 0;
			};
		}
		else {
			goto('/auth/login');
		}
	});
</script>

<div class="flex min-h-screen flex-col">
	<nav class="bg-white-100 flex items-center p-5 text-white">
		<!-- <a href="/" class="justify-end text-xl">MatchPoint</a> -->
		<a href="/">
			<img src="/assets/logo.png" alt="MatchPoint" class="h-16 w-auto" />
			<text class="text-xl font-bold">{$locationStore.latitude}</text>
			<text class="text-xl font-bold">{$locationStore.longitude}</text>
		</a>
		{#if !data.user?.userId}
			<a class="relative ml-auto" href="/auth/login">Login</a>
		{/if}
		{#if data.user?.userId}
			<div class="ml-auto flex items-center gap-4">
				<div class="dropdown dropdown-end">
					<button
						type="button"
						class="avatar avatar-online before:h-2 before:w-2"
						class:before:bg-pink-500={notificationsOn}
						class:before:bg-black={!notificationsOn}
					>
						<div class="dropdown-content card card-sm bg-base-100 md:w-96 z-10 max-h-48 w-60 shadow-md">
							<div class="card-body max-h-36 overflow-y-auto">
								{#if notifications.length == 0}
									<p class="text-center text-xl text-gray-500">No tienes nuevas notificaciones.</p>
								{:else}
									{#each notifications as notification}
										<div class="flex flex-row items-start justify-start gap-2">
											<text class="flex flex-row gap-1 justify-start text-start md:text-base text-sm">
												<p>{notification.message}</p>
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
												<text />
											</text>
										</div>
									{/each}
								{/if}
							</div>
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<div
								class="btn btn-primary w-fit"
								role="button"
								tabindex="0"
								onclick={redirectToNotifications}
							>
								Ver todas
							</div>
						</div>
						<div class="w-8 rounded-full">
							<img src={NotificationIcon} alt="notifications" />
						</div>
					</button>
				</div>
				<div
					class="avatar dropdown dropdown-hover dropdown-end relative ml-auto cursor-pointer"
				>
				<div class="w-12 rounded">
					<img
					class="rounded-xl"
					src={data.user.images != null ? data.user.images[0] : '/assets/GatoSexo.png'}
					alt="User avatar"
					/>
				</div>
					<ul class="menu dropdown-content rounded-box bg-base-100 z-1 w-52 p-2 shadow-sm">
						<li>
							<a href={`/users/${data.user.username}`} class="block h-full w-full">Profile</a>
						</li>
						<li><a href="/settings" class="block h-full w-full">Settings</a></li>
						<li>
							<a href="/blocked-users" class="block h-full w-full">Blocked Users</a>
						</li>
						<li>
							<a href="/last-visits" class="block h-full w-full">Last Visits</a>
						</li>
						<li>
							<a
								href="/logout"
								class="bg-primary block h-full w-full"
								onclick={() => invalidateAll()}>Log Out</a
							>
						</li>
					</ul>
				</div>
			</div>
		{/if}
	</nav>

	<!-- <main class="flex min-h-[calc(100vh-5rem-5rem)] flex-1 items-center justify-center">
	{@render children()}
</main> -->

	<main class="mb-16 flex h-screen flex-1 items-center justify-center">
		{@render children()}
	</main>

	<footer class="relative bottom-0 w-full bg-slate-700 p-4 text-center text-white">
		<p>© 2025 - MatchPoint - Ningún derecho reservado realmente</p>
	</footer>
</div>
