<script lang="ts">
	import '../app.css';
	import type { LayoutServerData } from './$types';
	import { invalidateAll } from '$app/navigation';
import Page from './+page.svelte';
	let { children, data }: { children: any; data: LayoutServerData } = $props();

	console.log('data1:');
	console.log(data);

	let open = $state(false);
</script>

<nav class="flex items-center bg-transparent p-5 text-white">
	<!-- <a href="/" class="justify-end text-xl">MatchPoint</a> -->
	<a href="/">
		<img src="/src/assets/logo.png" alt="MatchPoint" class="w-auto h-16" />
	</a>
	{#if !data.user?.id}
		<a class="relative ml-auto" href="/auth/login">Login</a>
	{/if}
	{#if data.user?.id}
		<div class="avatar relative ml-auto">
			<button class="w-12 cursor-pointer" onclick={() => (open = !open)} aria-label="Toggle menu">
				<img
					class="rounded-xl"
					src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
					alt="User avatar"
				/>
			</button>
			{#if open}
				<ul class="absolute right-0 top-12 mt-2 w-48 rounded-lg bg-black shadow-lg">
					<li class="cursor-pointer px-4 py-2 hover:rounded-t-lg hover:bg-primary">
						<a href="/users" class="block h-full w-full">Profile</a>
					</li>
					<li class="cursor-pointer px-4 py-2 hover:bg-primary">
						<a href="/settings" class="block h-full w-full">Settings</a>
					</li>
					<li class="cursor-pointer px-4 py-2 hover:rounded-b-lg hover:bg-primary">
						<a href="/logout" class="block h-full w-full" onclick={() => invalidateAll()}>Log Out</a
						>
					</li>
				</ul>
			{/if}
		</div>
	{/if}
</nav>

<main class="flex min-h-[calc(100vh-5rem-5rem)] flex-1 items-center justify-center">
	{@render children()}
</main>

<footer class=" w-full bg-slate-700 p-4 text-center text-white">
	<p>© 2021 - MatchPoint - Todos los derechos reservados</p>
</footer>


<svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="512"
          height="512"
          x="0"
          y="0"
          viewBox="0 0 32 32"
          style="enable-background:new 0 0 512 512"
          xml:space="preserve"
          class=""
          ><g
            ><linearGradient
              id="a"
              x1="16"
              x2="16"
              y1="32.64"
              y2="5"
              gradientTransform="matrix(1 0 0 -1 0 34)"
              gradientUnits="userSpaceOnUse"
              ><stop offset="0" stop-color="#fd6087" /><stop
                offset="1"
                stop-color="#fd7e89"
              /></linearGradient
            ><path
              d="M12 22c-1.9 0-3.6-.7-4.9-2.1C5.7 18.6 5 16.9 5 15c0-2 .9-4.3 2.3-5.7l.1-.1C8.6 8 10 6.5 10 4c0-.4.2-.8.6-.9.4-.2.8-.1 1.1.2 1.2 1.2 3.1 5 1.7 8.3.2 0 .7-.3 1.8-2.1.1-.3.4-.5.7-.5s.6.1.8.3c1.1 1.2 2.3 3.8 2.3 5.7s-.7 3.6-2.1 4.9c-1.3 1.4-3 2.1-4.9 2.1zm-.5-15.1c-.7 1.7-1.8 2.8-2.6 3.7l-.1.1C7.7 11.8 7 13.5 7 15c0 1.3.5 2.6 1.5 3.5.9 1 2.2 1.5 3.5 1.5s2.6-.5 3.5-1.5S17 16.3 17 15c0-.9-.5-2.2-1-3.2-.8 1.1-1.5 1.6-2.3 1.8-1 .2-1.8-.4-2.3-.8-.4-.3-.5-.9-.2-1.3.9-1.5.7-3.2.3-4.6z"
              fill="#ffffff"
              opacity="1"
              data-original="#000000"
              class=""
            /></g
          ></svg
        >