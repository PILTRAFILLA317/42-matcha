<script lang="ts">
	import '../app.css';
	import type { LayoutServerData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	let { children, data }: { children: any; data: LayoutServerData } = $props();
	import { locationStore } from '$lib/stores/location';
	import NotificationIcon from '/src/assets/notifications.svg';
	import { parse } from 'svelte/compiler';
	let eventSource: EventSource;

	type Notification = {
		message: string;
		type: string;
	};

	let notifications = $state<Notification[]>([]);
	let notificationsOn = $state(false);

	async function getUnreadNotifications() {
		console.log('Obteniendo notificaciones no leídas...');
		try {
			const res = await fetch(`/api/notifications/get-unread?userId=${data.user?.userId}`);
			const resData = await res.json();

			if (res.ok) {
				notifications = resData;
				if (resData.length > 0) {
					notificationsOn = true;
				}
				return resData;
			} else {
				console.error('Error al obtener las notificaciones no leídas.');
			}
		} catch (err) {
			console.error('Error al obtener las notificaciones no leídas.');
		}
	}

	// Obtener ubicación al cargar la página
	async function getLocation() {
		if (data.user?.location) {
			return;
		}

		console.log('Obteniendo ubicación...');
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
						console.log('Actualizando ubicación en la base de datos...');
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
			console.log('Geolocation is not supported by this browser.');
			await getLocationByIP(); // Respaldo con IP
		}
	}

	function redirectToNotifications() {
		notificationsOn = false;
		notifications = [];
		window.location.href = '/notifications';
		console.log('Redirigiendo a notificaciones...');
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
				// locationStore.set(location);
				// localStorage.setItem('user-location', JSON.stringify(location)); // Guarda en localStorage
			} else {
				console.log('Error al obtener la ubicación por IP.');
			}
		} catch (err) {
			console.log('Error al obtener la ubicación por IP.');
		}
	}

	async function updateLocation(location: { latitude: number; longitude: number }) {
		try {
			const body = JSON.stringify({
				latitude: location.latitude,
				longitude: location.longitude
			});
			console.log('Body:', body);
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
				console.log('Ubicación actualizada en la base de datos.');
			}
		} catch (err) {
			console.log('RES:', data);
			console.log('Error al actualizar la ubicación en la base de datos.');
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
			console.error('Error al parsear la notificación:', error);
			return null;
		}
	}

	// Ejecutar la lógica al cargar la página
	onMount(() => {
		getUnreadNotifications();
		console.log('🚀 Iniciando...');
		getLocation();
		// 🚨 Inicia una conexión SSE hacia el backend
		// if (eventSource) {
		// 	eventSource.close(); // Cierra la conexión anterior antes de abrir otra
		// }
		try {
			if (eventSource) {
				console.log('🚨 Cerrando conexión anterior...');
				eventSource.close();
			}

			console.log('🚀 Iniciando conexión SSE...');
			eventSource = new EventSource(`/api/notifications/stream`);
			// eventSource = new EventSource(`/api/notifications/stream`);

			console.log('🚀 Conexión establecida con el servidor de eventos.');

			if (!eventSource) {
				console.error('❌ No se pudo establecer la conexión con el servidor de eventos.');
				return;
			}

			eventSource.onopen = () => {
				console.log('✅ Conexión establecida con SSE.');
			};

			eventSource.onmessage = (event) => {
				try {
					const parsedData = JSON.parse(event.data);
					const parse = parseNotification(parsedData);
					const notification: Notification = {
						message: parse?.message,
						type: parse?.type
					};
					notifications = [...notifications, notification];
					notificationsOn = true;
				} catch (err) {
					console.error('❌ Error al procesar el mensaje SSE:', err, event.data);
				}
			};

			eventSource.onerror = (error) => {
				console.error('❌ ERROR1 en SSE:', error);
				eventSource.close();
			};
		} catch (error) {
			console.error('❌ ERROR2 en SSE:', error);
		}
	});
</script>

<nav class="flex items-center bg-transparent p-5 text-white">
	<!-- <a href="/" class="justify-end text-xl">MatchPoint</a> -->
	<a href="/">
		<img src="/src/assets/logo.png" alt="MatchPoint" class="h-16 w-auto" />
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
					<div class="dropdown-content card card-sm bg-base-100 z-10 max-h-48 w-96 shadow-md">
						<div class="card-body max-h-36 overflow-y-auto">
							{#if notifications.length == 0}
								<p class="text-center text-xl text-gray-500">No tienes nuevas notificaciones.</p>
							{:else}
								{#each notifications as notification}
									<div class="flex flex-row items-center justify-start gap-2">
										<text class="flex flex-row text-start text-base gap-1">
											<p>{notification.message}</p>
											<p>{notification.type === 'visit' ? 'ha visto tu perfil 👀' : ''}</p>
											<text />
										</text>
									</div>
								{/each}
							{/if}
						</div>
						<div class="btn btn-primary w-xs" role="button" tabindex="0" onclick={redirectToNotifications}>Ver todas</div>
					</div>
					<div class="w-8 rounded-full">
						<img src={NotificationIcon} alt="notifications" />
					</div>
				</button>
			</div>
			<!-- <div class="avatar avatar-offline">
				<div class="w-24 rounded-full">
					<img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
				</div>
			</div> -->
			<div class="avatar dropdown dropdown-hover dropdown-end relative ml-auto w-12 cursor-pointer">
				<img
					class="rounded-xl"
					src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
					alt="User avatar"
				/>
				<ul class="menu dropdown-content rounded-box bg-base-100 z-1 w-52 p-2 shadow-sm">
					<li><a href={`/users/${data.user.username}`} class="block h-full w-full">Profile</a></li>
					<li><a href="/settings" class="block h-full w-full">Settings</a></li>
					<li>
						<a href="/logout" class="block h-full w-full" onclick={() => invalidateAll()}>Log Out</a
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

<main class="mb-16 flex flex-1 items-center justify-center">
	{@render children()}
</main>

<footer class="relative bottom-0 w-full bg-slate-700 p-4 text-center text-white">
	<p>© 2025 - MatchPoint - Ningún derecho reservado realmente</p>
</footer>
