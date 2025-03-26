<script lang="ts">
	import { onMount } from 'svelte';
    import { page } from '$app/stores';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let isLoading = $state<boolean>(data.user?.verified === false ? true : false);

	onMount(async () => {
		// console.log('HOLA ME ESTOY CREANDO');
		// try {
		// 	const res = await fetch(`/${page.params.mailReference}`, {
		// 		method: 'POST',
		// 		headers: {
		// 			'Content-Type': 'application/json'
		// 		},
		// 		body: JSON.stringify({ mailReference: params.mailReference })
		// 	});
		// 	console.log('fetch result is==> ', res);
		// 	if (!res.ok) {
		// 		return { error: res.statusText };
		// 	}
		// 	isLoading = false;
		// } catch (error) {
		// 	console.error(error);
		// }
	});
</script>

<div class="flex h-screen w-screen items-center justify-center bg-secondary">
	<div class="w-96 rounded-2xl bg-slate-900 p-8 text-center shadow-lg">
		<h1 class="mb-4 text-2xl font-bold">Email Verification</h1>
		{#if isLoading}
			<div class="flex justify-center">
				<span class="loading loading-spinner loading-lg"></span>
			</div>
		{:else}
			<p class="text-left text-sm text-slate-300">Email verification successful!</p>
		{/if}
	</div>
</div>
