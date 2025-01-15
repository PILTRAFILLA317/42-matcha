<script lang="ts">
    import type { ActionData, PageData } from './$types';
    import { enhance } from '$app/forms';
    
    let { form }: { form: ActionData } = $props();
</script>

<div class="mx-auto max-w-md rounded-lg bg-primary p-6 shadow-md">
	<h2 class="mb-4 text-center text-2xl font-semibold text-secondary">
		Register
	</h2>

	<form method="post" use:enhance>
		<div class="mb-4">
			<label for="email" class="block text-sm font-medium text-secondary">Email</label>
			<input
				id="email"
				type="text"
				name="email"
				class="input input-bordered mt-1 w-full"
				placeholder="Your email"
				required
			/>
		</div>
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
			<label for="FirstName" class="block text-sm font-medium text-secondary">First Name</label>
			<input
				id="firstname"
				type="text"
				name="firstname"
				class="input input-bordered mt-1 w-full"
				placeholder="Your First Name"
				required
			/>
		</div>
		<div class="mb-4">
			<label for="LastName" class="block text-sm font-medium text-secondary">Last Name</label>
			<input
				id="lastname"
				type="text"
				name="lastname"
				class="input input-bordered mt-1 w-full"
				placeholder="Your Last Name"
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
		<div class="mb-4">
			<label for="repeatPassword" class="block text-sm font-medium text-secondary">Repeat Password</label>
			<input
				id="repeatpassword"
				type="password"
				name="repeatpassword"
				class="input input-bordered mt-1 w-full"
				placeholder="********"
				required
			/>
		</div>
		<button
			formaction={'?/register'}
			type="submit"
			class="btn btn-secondary mb-4 w-full">Register</button
		>
	</form>
</div>
