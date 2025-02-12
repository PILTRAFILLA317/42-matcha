<script lang="ts">
	import { redirect } from '@sveltejs/kit';

	export let username: string;
	export let onclick: () => void;
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onclick={onclick} class="hero rounded-lg bg-base-200">
	<div class="hero-content flex w-full items-center justify-between gap-0">
		<img
			alt={username ??  'User'}
			width="50px"
			height="50px"
			src="https://preview.redd.it/cl75nwhg00q91.jpg?width=360&format=pjpg&auto=webp&s=6778f52c300832b47e77f8d815a0d1dfa808123e"
			class="rounded-full shadow-2xl"
		/>
		<div class="mx-4 flex-1">
			<h1 class="w-[100%] text-2xl font-semibold">{username ?? 'Username'}</h1>
		</div>
	</div>
</div>
