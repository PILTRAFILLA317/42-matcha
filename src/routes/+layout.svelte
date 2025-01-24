<script lang="ts">
	import '../app.css';
	import type { LayoutServerData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import Page from './+page.svelte';
	let { children, data }: { children: any; data: LayoutServerData } = $props();

	// console.log('data1:');
	// console.log(data);

	let open = $state(false);
</script>

<nav class="flex items-center bg-transparent p-5 text-white">
	<!-- <a href="/" class="justify-end text-xl">MatchPoint</a> -->
	<a href="/">
		<img src="/src/assets/logo.png" alt="MatchPoint" class="h-16 w-auto" />
	</a>
	{#if !data.user?.id}
		<a class="relative ml-auto" href="/auth/login">Login</a>
	{/if}
	{#if data.user?.id}
		<div class="avatar relative ml-auto dropdown dropdown-hover dropdown-end w-12 cursor-pointer">
				<img
					class="rounded-xl "
					src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
					alt="User avatar"
				/>
			<ul class="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow">
				<li><a href="/users" class="block h-full w-full">Profile</a></li>
				<li><a href="/settings" class="block h-full w-full">Settings</a></li>
				<li><a href="/logout" class="block h-full w-full" onclick={() => invalidateAll()}>Log Out</a></li>
			</ul>
		</div>
	{/if}
</nav>

<main class="flex min-h-[calc(100vh-5rem-5rem)] flex-1 items-center justify-center">
	{@render children()}
</main>

<footer class=" w-full bg-slate-700 p-4 text-center text-white">
	<p>© 2021 - MatchPoint - Todos los derechos reservados</p>
</footer>
