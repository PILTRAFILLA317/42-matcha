<script lang="ts">
	import '../app.css';
	import type { LayoutServerData } from './$types';
	import { invalidateAll } from '$app/navigation';
	let { children, data }: { children: any, data: LayoutServerData } = $props();

	console.log("data1:");
	console.log(data);

	let open = $state(false);
</script>

<nav class="flex items-center bg-slate-700 p-4 text-white">
	<a href="/" class="justify-end text-xl">MatchPoint</a>
	{#if !data.user?.id}
		<a class= "ml-auto relative" href="/auth/login">Login</a>
	{/if}
	{#if data.user?.id}
		<div class="avatar ml-auto relative">
			<button class="w-12 cursor-pointer" onclick={() => open = !open} aria-label="Toggle menu">
				<img class="rounded-xl" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="User avatar" />
			</button>
			{#if open}
				<ul class="absolute top-12 right-0 mt-2 w-48 bg-black rounded-lg shadow-lg">
					<li class="px-4 py-2 hover:bg-primary hover:rounded-t-lg cursor-pointer">
						<a href="/profile" class="block w-full h-full">Profile</a>
					</li>
					<li class="px-4 py-2 hover:bg-primary cursor-pointer">
						<a href="/settings" class="block w-full h-full">Settings</a>
					</li>
					<li class="px-4 py-2 hover:bg-primary hover:rounded-b-lg cursor-pointer">
						<a href="/logout" class="block w-full h-full" onclick={() => invalidateAll()}>Log Out</a>
					</li>
				</ul>
			{/if}
		</div>
	{/if}
</nav>

{@render children()}

<footer class="bg-slate-700 p-4 text-center text-white fixed bottom-0 w-full">
	<p>© 2021 - MatchPoint - Todos los derechos reservados</p>
</footer>
