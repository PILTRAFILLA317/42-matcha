<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let seePassword = $state(false);
	let iconsize = 5;
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="mx-auto max-w-xl rounded-lg bg-secondary p-6 shadow-md">
	<h1 class="mb-4 text-center text-2xl font-semibold text-primary">Change Password</h1>
	<form method="post" use:enhance class="space-y-4">
		<label for="currentPassword" class="block text-sm font-medium text-primary"
			>Current Password</label
		>
		<div class="flex justify-between">
			<input
				id="currentPassword"
				type={seePassword ? 'password' : 'text'}
				name="currentPassword"
				class="input input-bordered mt-1 w-full"
				placeholder="Your Current Password"
				required
			/>
			{#if seePassword}
				<img
					class="pl-5 h-{iconsize} self-center"
					src="/src/assets/visible.png"
                    alt="made by https://www.flaticon.com/free-icons/close"
					onclick={() => (seePassword = !seePassword)}
				/>
			{:else}
				<img
					class="pl-5 h-{iconsize} self-center"
					src="/src/assets/eye.png"
                    alt="made my https://www.flaticon.com/authors/th-studio"
					onclick={() => (seePassword = !seePassword)}
				/>
			{/if}
		</div>
		<label for="newPassword" class="block text-sm font-medium text-primary">New Password</label>
		<div class="flex justify-between">
			<input
				id="newPassword"
				type={seePassword ? 'password' : 'text'}
				name="newPassword"
				class="input input-bordered mt-1 w-full"
				placeholder="Your New Password"
				required
			/>
			{#if seePassword}
				<img
					class="pl-5 h-{iconsize} self-center"
					src="/src/assets/visible.png"
                    alt="made by https://www.flaticon.com/free-icons/close"
					onclick={() => (seePassword = !seePassword)}
				/>
			{:else}
				<img
					class="pl-5 h-{iconsize} self-center"
					src="/src/assets/eye.png"
                    alt="made my https://www.flaticon.com/authors/th-studio"
					onclick={() => (seePassword = !seePassword)}
				/>
			{/if}
		</div>
		<label for="confirmPassword" class="block text-sm font-medium text-primary"
			>Confirm Password</label
		>
		<div class="flex justify-between">
			<input
				id="confirmPassword"
				type={seePassword ? 'password' : 'text'}
				name="confirmPassword"
				class="input input-bordered mt-1 w-full"
				placeholder="Confirm Your New Password"
				required
			/>
			{#if seePassword}
				<img
					class="pl-5 h-{iconsize} self-center"
					src="/src/assets/visible.png"
                    alt="made by https://www.flaticon.com/free-icons/close"
					onclick={() => (seePassword = !seePassword)}
				/>
			{:else}
				<img
					class="pl-5 h-{iconsize} self-center"
					src="/src/assets/eye.png"
                    alt="made my https://www.flaticon.com/authors/th-studio"
					onclick={() => (seePassword = !seePassword)}
				/>
			{/if}
		</div>
		<button formaction={"?/updatePassword"} type="submit" class="btn btn-primary w-full">Change Password</button>
	</form>
</div>
