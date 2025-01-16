<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	console.log("data2:");
	console.log(data);
</script>

<h1>Hi, {data.user.username}!</h1>
<p>Your user ID is {data.user.id}.</p>
<form method="post" action="?/logout" use:enhance>
	<button>Sign out</button>
</form>

<div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md ">
	<!-- <h2 class="text-2xl font-semibold text-center mb-4">
		{data.user.username}
	</h2> -->

	<!-- <form method="post" action="?/logout" use:enhance>
		<button class="btn btn-primary w-full">Sign out</button>
	</form> -->
</div>

