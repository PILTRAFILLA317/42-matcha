<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData, data: FormData } = $props();
</script>

<div class="mx-auto max-w-md rounded-lg bg-sky-900 p-6 shadow-md">
	<h2 class="mb-4 text-center text-2xl font-semibold text-secondary">Login</h2>

	<form method="post" use:enhance>
		<div class="mb-4">
			<label for="username" class="block text-sm font-medium text-secondary">Username</label>
			<input
				id="username"
				type="text"
				name="username"
				class="input input-bordered mt-1 w-full"
				placeholder="Your username"
				required
			/>
		</div>
		<div class="mb-4">
			<label for="Password" class="block text-sm font-medium text-secondary">Password</label>
			<input
				id="password"
				type="password"
				name="password"
				class="input input-bordered mt-1 w-full"
				placeholder="********"
				required
			/>
		</div>
		<button
			formaction={'?/login'}
			type="submit"
			class="btn btn-secondary mb-4 w-full">Login</button
		>
	</form>
	<div class="align-center mb-4 flex justify-center">
		<p class="text-white">{form?.message ?? ''}</p>
	</div>
	<div class="text-center">
		<a class="text-sm text-secondary hover:underline" href="/auth/register">
			Don't have an account? Register
		</a>
	</div>
	<div class="text-center">
		<a class="text-sm text-secondary hover:underline" href="/auth/login/forgotpassword">
			Forgot your password?
    </a>
	</div>
</div>
