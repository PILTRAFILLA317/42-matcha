<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<div data-sveltekit-preload-data="hover" class="mx-auto w-xl rounded-lg bg-sky-900 p-6 shadow-md space-y-4">
	<div class="mb-4 flex">
		<a href="/settings" class="relative flex-none pt-1 text-white hover:text-gray-300">
			<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
				><path fill="currentColor" d="M10 22L0 12L10 2l1.775 1.775L3.55 12l8.225 8.225z" /></svg
			>
		</a>
		<h1 class="text-primary mb-4 flex-1 text-center text-2xl font-semibold">Email Settings</h1>
	</div>
	<form method="post" use:enhance>
		<div class="mb-4">
			<label for="email" class="text-primary block text-sm font-medium">Email</label>
			<input
				id="email"
				type="text"
				name="email"
				class="input input-bordered mt-1 w-full"
				placeholder="Your Email"
				value={data.user.email}
				required
			/>
		</div>
		<div class="">
			<div class="text-center">{form?.message ?? ''}</div>
		</div>
		<button formaction={'?/changeEmail'} type="submit" class="btn btn-primary w-full">
			Change Email
		</button>
	</form>
	{#if data.user.verified == false}
	<div>
		<form method="post" use:enhance>
			<button formaction={'?/verifyEmail'} type="submit" class="btn btn-primary w-full">
				Verify Email
			</button>
		</form>
	</div>
	{/if}
</div>
