<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let seePassword = $state(false);
	let iconsize = 13;
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="bg-secondary mx-auto w-lg rounded-lg p-6 shadow-md">
	<h1 class="text-primary mb-4 text-center text-2xl font-semibold">Change Password</h1>
	<form method="post" use:enhance class="space-y-4">
		<div>
			<label for="currentPassword" class="text-primary block text-sm font-medium"
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
						class="pl-5 w-{iconsize} self-center"
						src="/src/assets/visible.png"
						alt="made by https://www.flaticon.com/free-icons/close"
						onclick={() => (seePassword = !seePassword)}
					/>
				{:else}
					<img
						class="pl-5 w-{iconsize} self-center"
						src="/src/assets/eye.png"
						alt="made my https://www.flaticon.com/authors/th-studio"
						onclick={() => (seePassword = !seePassword)}
					/>
				{/if}
			</div>
		</div>
		<div>
			<label for="newPassword" class="text-primary block text-sm font-medium">New Password</label>
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
						class="pl-5 w-{iconsize} self-center"
						src="/src/assets/visible.png"
						alt="made by https://www.flaticon.com/free-icons/close"
						onclick={() => (seePassword = !seePassword)}
					/>
				{:else}
					<img
						class="pl-5 w-{iconsize} self-center"
						src="/src/assets/eye.png"
						alt="made my https://www.flaticon.com/authors/th-studio"
						onclick={() => (seePassword = !seePassword)}
					/>
				{/if}
			</div>
		</div>
		<div>
			<label for="confirmPassword" class="text-primary block text-sm font-medium"
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
						class="pl-5 w-{iconsize} self-center"
						src="/src/assets/visible.png"
						alt="made by https://www.flaticon.com/free-icons/close"
						onclick={() => (seePassword = !seePassword)}
					/>
				{:else}
					<img
						class="pl-5 w-{iconsize} self-center"
						src="/src/assets/eye.png"
						alt="made my https://www.flaticon.com/authors/th-studio"
						onclick={() => (seePassword = !seePassword)}
					/>
				{/if}
			</div>
		</div>
		<button formaction={'?/updatePassword'} type="submit" class="btn btn-primary w-full"
			>Change Password</button
		>
	</form>
</div>
