<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let seePassword = $state(false);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class="mx-auto max-w-md rounded-lg bg-primary p-6 shadow-md">
	<h2 class="mb-4 text-center text-2xl text-secondary">Recover Password</h2>
	<form method="post" use:enhance>
		<div class="mb-4 flex justify-between">
			<input
				id="newpassword"
				type={seePassword ? 'password' : 'text'}
				name="newpassword"
				class="input input-bordered mt-1 w-full bg-white text-black"
				placeholder="New password"
				required
			/>
			{#if seePassword}
				<img
					class="pl-5 h-[40px] self-center"
					src="/src/assets/visible.png"
					alt="made by https://www.flaticon.com/free-icons/close"
					onclick={() => (seePassword = !seePassword)}
				/>
			{:else}
				<img
					class="pl-5 h-[40px] self-center"
					src="/src/assets/eye.png"
					alt="made my https://www.flaticon.com/authors/th-studio"
					onclick={() => (seePassword = !seePassword)}
				/>
			{/if}
		</div>
		<p class="text-black">{form?.message ?? ''}</p>
		<div>
			<button formaction={'?/changepassword'} type="submit" class="btn btn-secondary mb-4 w-full">
				Change Password
			</button>
		</div>
		<div>
			<img alt="monkey happy" src="https://media1.tenor.com/m/J_PBo6NeOrUAAAAd/monkey-spin.gif" />
		</div>
	</form>
</div>
