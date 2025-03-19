<script lang="ts">
	import ChatIcon from '/src/assets/chat.svg';
	import HeartFillIcon from '/src/assets/heart-fill.svg';
	import HeartEmptyIcon from '/src/assets/heart-empty.svg';
	import { onMount } from 'svelte';
	import { notificationState } from '$lib/stores/notifications.svelte';
	import { goto } from '$app/navigation';

	const { data } = $props();

	let currentUser = data.currentUser;

	let registeredUser = data.user;

	let userDistance = userDistanceCalc();

	let isLiked = $state(false);
	let isMatched = $state(false);
	let isBlocked = $state(false);

	let notifications = $derived(notificationState.AllNotifications);
	$effect(() => {
		// notifications;
		notifications.length;
		if (
			notificationState.getLastNotification()?.type === 'match' &&
			notificationState.getLastNotification()?.message === currentUser?.username
		) {
			matchAnimation();
			isMatched = true;
		}
		if (
			notificationState.getLastNotification()?.type === 'unlike' &&
			notificationState.getLastNotification()?.message === currentUser?.username
		) {
			isMatched = false;
		}
	});

	async function checkIfUserLiked() {
		const response = await fetch('/api/check-like', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				likedUserUsername: currentUser?.username
			})
		});
		const result = await response.json();
		isLiked = result;
	}

	async function checkIfUserBlocked() {
		const response = await fetch('/api/check-block', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				blockedUserUsername: currentUser?.username
			})
		});
		const result = await response.json();
		isBlocked = result.message;
		console.log('Blocked:', isBlocked);
	}

	async function areMatched() {
		const response = await fetch('/api/match', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: currentUser?.username
			})
		});
		const result = await response.json();
		if (result === true) {
			isMatched = true;
		}
	}

	async function likeUser() {
		const response = await fetch('/api/like-user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				likedUserUsername: currentUser?.username,
				liked: true
			})
		});
		const result = await response.json();
		if (isLiked) {
			isLiked = false;
			isMatched = false;
		} else isLiked = true;
	}

	async function blockUser() {
		const response = await fetch('/api/block-user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				blockedUserUsername: currentUser?.username,
				userId: registeredUser.userId
			})
		});
		const result = await response.json();
		if (isBlocked) {
			isBlocked = false;
			isMatched = false;
		} else isBlocked = true;
		if (isLiked) {
			isLiked = false;
			isMatched = false;
		}
	}

	async function reportUser() {
		const response = await fetch('/api/report', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({})
		});
		const result = await response.json();
	}

	function userDistanceCalc() {
		if (currentUser && currentUser.location && registeredUser && registeredUser.location) {
			const [lat1, lon1] = currentUser.location; // Lat/Lon del usuario actual
			const [lat2, lon2] = registeredUser.location; // Lat/Lon del usuario registrado

			const toRadians = (degrees: number) => (degrees * Math.PI) / 180; // Conversión a radianes

			const R = 6371; // Radio de la Tierra en kilómetros
			const dLat = toRadians(lat2 - lat1); // Diferencia de latitudes en radianes
			const dLon = toRadians(lon2 - lon1); // Diferencia de longitudes en radianes

			const a =
				Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos(toRadians(lat1)) *
					Math.cos(toRadians(lat2)) *
					Math.sin(dLon / 2) *
					Math.sin(dLon / 2);

			const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

			const distance = R * c; // Distancia en kilómetros
			return Math.floor(distance); // Redondear hacia abajo
		}

		return 0; // Si faltan datos
	}

	async function getLocationAddress() {
		if (currentUser && currentUser.location) {
			try {
				const res = await fetch('../api/reverse-geocode', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						latitude: currentUser.location[0],
						longitude: currentUser.location[1]
					})
				});
				const data = await res.json();
				if (res.ok) {
					return data.city;
				}
			} catch (error) {
				return 'No location';
			}
		}
		return 'No location';
	}

	let currentUserLocation = $state<string | undefined>(undefined);
	async function fetchLocation() {
		currentUserLocation = await getLocationAddress();
	}

	async function profileVisit() {
		const res = await fetch('../api/visit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: currentUser?.username,
				visitedUserId: registeredUser.userId
			})
		});
		const data = await res.json();
		if (res.ok) {
		}
	}

	async function matchAnimation() {
		modal?.showModal();
		await new Promise((resolve) => setTimeout(resolve, 2000));
		modal?.close();
	}

	let modal: HTMLDialogElement | null = $state(null);

	function chatUser() {
		goto(`/chat?user=${currentUser?.username}`);
	}

	onMount(async () => {
		if (currentUser?.username != registeredUser?.username) {
			await profileVisit();
		}
		await areMatched();
		await fetchLocation();
		await checkIfUserLiked();
		await checkIfUserBlocked();
	});
</script>

{#if !currentUser}
	<img src="https://pbs.twimg.com/media/F8mH-keWMAANehe.jpg" class="" alt="ese pibe no esiste" />
{/if}
{#if currentUser}
	<dialog bind:this={modal} class="modal p-40 backdrop-blur-sm">
		<text class="text-9xl">Bocata lomo hoy!</text>
		<img
			src="https://pbs.twimg.com/media/F8mH-keWMAANehe.jpg"
			class="mask mask-heart size-100"
			alt="ese pibe no esiste"
		/>
	</dialog>
	<div
		class="shadow-neutral m-10 flex max-w-[1200px] flex-col gap-4 rounded-3xl p-3 text-white shadow-2xl md:m-5 md:flex-row"
	>
		<div class="carousel relative aspect-1/1 max-w-[600px] rounded-2xl">
			{#each currentUser.images as image, i}
				<div id="slide{i}" class="carousel-item relative w-full">
					<img src={image} class="w-200" alt="alt{i}" />
					<div
						class="absolute top-1/2 right-5 left-5 flex -translate-y-1/2 transform justify-between"
					>
						<a href="#slide{i - 1}" class="btn btn-circle">❮</a>
						<a href="#slide{i + 1}" class="btn btn-circle">❯</a>
					</div>
				</div>
			{/each}
			{#if currentUser.images == null}
				<div id="slide1" class="carousel-item relative w-full">
					<img src="/src/assets/GatoSexo.png" class="w-full" alt="Gato" />
				</div>
			{/if}
		</div>
		<div class="flex flex-col justify-between">
			<div>
				<div class="flex flex-row items-start justify-between">
					<h1 class="mb-5 text-5xl font-bold">{currentUser?.firstName} {currentUser?.lastName}</h1>
					{#if currentUser.username != registeredUser.username}
						<div class="dropdown dropdown-top dropdown-left">
							<div tabindex="0" role="button" class="btn btn-ghost btn-circle">
								<svg
									width="20px"
									height="20px"
									viewBox="0 0 16 16"
									xmlns="http://www.w3.org/2000/svg"
									fill="#ffffff"
									class="bi bi-three-dots-vertical"
									><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
										id="SVGRepo_tracerCarrier"
										stroke-linecap="round"
										stroke-linejoin="round"
									></g><g id="SVGRepo_iconCarrier">
										<path
											d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
										></path>
									</g></svg
								>
							</div>
							<ul
								tabindex="0"
								class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
							>
								<!-- <li><a>Item 1</a></li>
								<li><a>Item 2</a></li> -->
								<li>
									<button class="text-md flex items-center gap-2" onclick={blockUser}>
										{isBlocked ? 'Unblock user 🔓' : 'Block user 🚫'}
									</button>
								</li>
								<li>
									<button class="text-md flex items-center gap-2" onclick={reportUser}
										>Report user 🚨</button
									>
								</li>
							</ul>
						</div>
					{/if}
				</div>
				<div class="flex items-center justify-between gap-1">
					<div class="flex items-center gap-1">
						<h1 class="mr-5 text-3xl font-bold">@{currentUser?.username}</h1>
						<!-- <p class="text-2xl font-bold text-primary">2</p> -->
						<p class="text-primary text-2xl font-bold">
							{currentUser.totalLikes}
						</p>
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
					</div>
				</div>
				<div class="mt-2">
					{#if currentUser?.isOnline}
						<p class="text-xl text-green-500">En línea</p>
					{:else}
						<p class="text-xl text-gray-600">
							Última conexión: {new Date(currentUser.lastConnection).toLocaleString()}
						</p>
					{/if}
				</div>
				<div class="mt-4 flex">
					<div class="flex-row">
						<div class="flex items-center justify-center gap-3">
							<svg viewBox="0 0 48 48" style="enable-background:new 0 0 512 512" class="w-8"
								><g
									><path
										d="M14.42 35.17v5.53H8.95v2h5.46v5.05h2V42.7h5.46v-2h-5.46v-5.53c3.62-.29 6.79-2.15 8.85-4.89.6.09 1.19.14 1.79.14 3.16 0 6.31-1.2 8.71-3.6 4.57-4.57 4.78-11.85.67-16.69l6.47-6.47v7.43h2V1.25c0-.55-.45-1-1-1h-9.85v2h7.43l-6.47 6.47c-4.84-4.11-12.12-3.9-16.69.67-.41.41-.78.85-1.12 1.31-.59-.09-1.2-.15-1.82-.15-6.8 0-12.34 5.54-12.34 12.34.04 6.46 5.04 11.77 11.38 12.28zm5.35-24.37c2.01-2.01 4.66-3.02 7.3-3.02s5.29 1.01 7.3 3.02c4.03 4.03 4.03 10.58 0 14.6-2.17 2.17-5.08 3.16-7.92 2.99.83-1.66 1.31-3.53 1.31-5.51 0-5.41-3.51-10.01-8.36-11.67.12-.13.23-.27.37-.41zm-1.62 2.12c4.38 1.2 7.61 5.21 7.61 9.96 0 1.88-.52 3.65-1.4 5.17-1.68-.45-3.27-1.33-4.59-2.65-3.38-3.37-3.91-8.53-1.62-12.48zm-2.73-.37c.22 0 .43.02.64.03-2.31 4.62-1.55 10.39 2.29 14.24 1.38 1.38 3.02 2.36 4.76 2.94a10.293 10.293 0 0 1-7.7 3.46c-5.7 0-10.34-4.64-10.34-10.34s4.65-10.33 10.35-10.33z"
										fill="#ffffff"
										opacity="1"
										data-original="#000000"
										class=""
									/></g
								></svg
							>
							<!-- <p class="text-2xl mr-3">Hombre heterosexual</p> -->
							<p class="mr-3 text-2xl">
								{currentUser.gender ? 'Hombre' : 'Mujer'}
								{currentUser.sexualPreferences}
							</p>
						</div>
					</div>
				</div>
				<div class="mt-4 flex items-center gap-3">
					<svg class="w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
						><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
							id="SVGRepo_tracerCarrier"
							stroke-linecap="round"
							stroke-linejoin="round"
						/><g id="SVGRepo_iconCarrier">
							<path
								d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z"
								stroke="#ffffff"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z"
								stroke="#ffffff"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</g></svg
					>
					<p class="text-2xl">{currentUserLocation} (A {userDistance}km)</p>
				</div>
				<p class="mt-4 flex items-center gap-3 text-2xl">
					<svg class="w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
						><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
							id="SVGRepo_tracerCarrier"
							stroke-linecap="round"
							stroke-linejoin="round"
						/><g id="SVGRepo_iconCarrier">
							<path
								d="M7 3V6M17 3V6M7.10002 20C7.56329 17.7178 9.58104 16 12 16C14.419 16 16.4367 17.7178 16.9 20M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21ZM14 11C14 12.1046 13.1046 13 12 13C10.8954 13 10 12.1046 10 11C10 9.89543 10.8954 9 12 9C13.1046 9 14 9.89543 14 11Z"
								stroke="#ffffff"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</g></svg
					>
					{currentUser.age} años
				</p>
				<div class="mt-8 mb-3 flex items-center gap-3">
					<svg
						viewBox="0 0 24 24"
						style="enable-background:new 0 0 512 512"
						xml:space="preserve"
						class="w-8"
						><g
							><g fill="#000"
								><path
									d="M14.52 11.32a5 5 0 1 0-5.038-8.64 5 5 0 0 0 5.037 8.64z"
									fill="#ffffff"
									opacity="1"
									data-original="#000000"
									class=""
								/><path
									d="M2 21a9.998 9.998 0 0 1 5.289-8.823C8.532 13.31 10.186 14 12 14s3.468-.69 4.711-1.823A9.999 9.999 0 0 1 22 21v.267a.733.733 0 0 1-.733.733H2.733A.733.733 0 0 1 2 21.267z"
									fill="#ffffff"
									opacity="1"
									data-original="#000000"
									class=""
								/></g
							></g
						></svg
					>
					<h2 class="text-2xl font-bold">Sobre mi</h2>
				</div>
				<p class="mr-8 mb-4 text-lg" style="white-space: pre-wrap; word-break: break-word;">
					{currentUser.bio}
				</p>
				<div class="mt-8 mb-4 flex items-center gap-3">
					<svg
						viewBox="0 0 512 512"
						style="enable-background:new 0 0 512 512"
						xml:space="preserve"
						class="w-8"
						><g
							><path
								d="M464.78 201.709a32 32 0 0 0 0-64h-54.621L424.3 84.95a32 32 0 1 0-61.818-16.565L343.9 137.709H231.49l26.11-97.427a32 32 0 1 0-61.819-16.564l-30.548 113.991H47.22a32 32 0 0 0 0 64h100.865l-29.094 108.582H47.22a32 32 0 1 0 0 64h54.622L87.705 427.05a32 32 0 1 0 61.818 16.565l18.577-69.324h112.41l-26.11 97.427a32 32 0 1 0 61.819 16.564l30.544-113.991H464.78a32 32 0 0 0 0-64H363.916l29.094-108.582zM297.659 310.291H185.248l29.094-108.582h112.411z"
								fill="#ffffff"
								opacity="1"
								data-original="#000000"
								class=""
							/></g
						></svg
					>
					<h2 class="text-2xl font-bold">Intereses</h2>
				</div>
				<div class="flex flex-wrap gap-3">
					{#if currentUser.userPreferences}
						{#each currentUser.userPreferences as preference}
							<div
								class="badge badge-secondary h-8 w-auto text-white {registeredUser?.userPreferences?.includes(
									preference
								)
									? ''
									: 'badge-outline'}"
							>
								{preference}
							</div>
						{/each}
					{/if}
				</div>
			</div>
			<div>
				{#if currentUser.userId != registeredUser.userId}
					<div class="mt-4 flex items-end justify-end">
						<button
							onclick={likeUser}
							class="btn btn-accent mr-2 grow rounded-3xl text-white"
							disabled={isBlocked}
						>
							<img src={isLiked ? HeartFillIcon : HeartEmptyIcon} alt="Like Icon" class="w-10" />
							{isLiked ? 'Liked!' : 'Like!'}
						</button>
						{#if isMatched}
							<button
								onclick={chatUser}
								class="btn btn-secondary flex items-center justify-center rounded-3xl"
							>
								<img src={ChatIcon} alt="Chat Icon" class="w-8" />
							</button>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
