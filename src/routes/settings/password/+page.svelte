<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let seePassword = $state(false);
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="mx-auto w-lg rounded-lg bg-sky-900 p-6 shadow-md space-y-3">
	<div class="mb-4 flex">
		<a
			href="/settings"
			class="relative flex-none pt-1 text-white hover:text-gray-300"
			aria-label="Back to settings"
		>
			<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
				><path fill="currentColor" d="M10 22L0 12L10 2l1.775 1.775L3.55 12l8.225 8.225z" /></svg
			>
		</a>
		<h1 class="text-primary mb-4 flex-1 text-center text-2xl font-semibold">Password Settings</h1>
	</div>
	<form method="post" use:enhance class="space-y-4">
		<div>
			<label for="currentPassword" class="text-primary block text-sm font-medium"
				>Current Password</label
			>
			<div class="flex justify-between">
				<input
					id="currentPassword"
					type={seePassword ? 'text' : 'password'}
					name="currentPassword"
					class="input input-bordered mt-1 w-full"
					placeholder="Your Current Password"
					required
				/>
				{#if seePassword == false}
					<img
						class="w-13 self-center pl-5"
						src="/assets/visible.png"
						alt="made by https://www.flaticon.com/free-icons/close"
						onclick={() => (seePassword = !seePassword)}
					/>
				{:else}
					<img
						class="w-13 self-center pl-5"
						src="/assets/eye.png"
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
					type={seePassword ? 'text' : 'password'}
					name="newPassword"
					class="input input-bordered mt-1 w-full"
					placeholder="Your New Password"
					required
				/>
				{#if seePassword == false}
					<img
						class="w-13 self-center pl-5"
						src="/assets/visible.png"
						alt="made by https://www.flaticon.com/free-icons/close"
						onclick={() => (seePassword = !seePassword)}
					/>
				{:else}
					<img
						class="w-13 self-center pl-5"
						src="/assets/eye.png"
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
					type={seePassword ? 'text' : 'password'}
					name="confirmPassword"
					class="input input-bordered mt-1 w-full"
					placeholder="Confirm Your New Password"
					required
				/>
				{#if seePassword == false}
					<img
						class="w-13 self-center pl-5"
						src="/assets/visible.png"
						alt="made by https://www.flaticon.com/free-icons/close"
						onclick={() => (seePassword = !seePassword)}
					/>
				{:else}
					<img
						class="w-13 self-center pl-5"
						src="/assets/eye.png"
						alt="made my https://www.flaticon.com/authors/th-studio"
						onclick={() => (seePassword = !seePassword)}
					/>
				{/if}
			</div>
		</div>
		<div class="align-center mb-4 flex justify-center">
			{#if form?.status == 201}
				<p class="text-white">{form?.message ?? ''}</p>
			{:else}
				<p class="text-red-200">{form?.message ?? ''}</p>
			{/if}
		</div>
		<button formaction={'?/updatePassword'} type="submit" class="btn btn-primary w-full"
			>Change Password</button
		>
	</form>
	<form method="post" use:enhance class="space-y-4">
		<button formaction={'?/recoverPassword'} type="submit" class="btn btn-primary w-full"
			>Recover Password</button
		>
	</form>
</div>
