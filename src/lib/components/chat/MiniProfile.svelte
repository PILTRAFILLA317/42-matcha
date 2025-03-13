<script lang="ts">
	export let username: string;
	export let pictures: Array<string>;
	export let onclick: () => void;
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onclick={onclick} class="hero rounded-lg bg-base-200">
	<div class="hero-content flex w-full items-center justify-between gap-0">
		<div class="avatar relative ml-auto w-12">
			<img
			alt={username ??  'User'}
			src="{pictures.length != 0? pictures[0] : "/src/assets/GatoSexo.png"}"
			class="rounded-full shadow-2xl object-scale-down"
			/>
		</div>
		<div class="mx-4 flex-1">
			<h1 class="w-[100%] text-2xl font-semibold">{username ?? 'Username'}</h1>
		</div>
	</div>
</div>
	