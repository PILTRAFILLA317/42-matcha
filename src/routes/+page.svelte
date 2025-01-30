<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="p-10">
	<h1>Hi, {data.user.username}!</h1>
	<p>Your user ID is {data.user.id}.</p>
	<div
		class="mx-auto flex max-w-md items-center justify-center rounded-lg bg-secondary p-6 shadow-md"
	>
		<!-- svelte-ignore event_directive_deprecated -->
		<form method="post" action="?/email" use:enhance>
			<button class="btn btn-primary">Email out</button>
	</div>
</div>

<div class="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
	<h2 class="mb-4 text-center text-2xl font-semibold">
		{data.user.username}
	</h2>
	<form method="post" action="?/logout" use:enhance>
		<button class="btn btn-primary w-full">Sign out</button>
	</form>
</div>
