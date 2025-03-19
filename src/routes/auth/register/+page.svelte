<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	console.log('Form is: ', form);
</script>

<div class="flex:column mx-3 w-md items-center rounded-lg bg-sky-900 p-6 shadow-md">
	<h2 class="text-primary mb-4 text-center text-2xl font-semibold">Register</h2>

	<form method="post" use:enhance>
		<div class="mb-4">
			<label for="email" class="text-primary block text-sm font-medium">Email</label>
			<input
				id="email"
				type="email"
				name="email"
				class="input input-bordered mt-1 w-full"
				placeholder="Your email"
				required
			/>
		</div>
		<div class="mb-4">
			<label for="username" class="text-primary block text-sm font-medium">Username</label>
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
			<label for="FirstName" class="text-primary block text-sm font-medium">First Name</label>
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
			<label for="LastName" class="text-primary block text-sm font-medium">Last Name</label>
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
			<label for="Age" class="text-primary block text-sm font-medium">Age</label>
			<div class="flex items-center space-x-1">
				<input
					id="age"
					type="number"
					name="age"
					class="input input-bordered mt-1 w-full"
					placeholder="Your Age"
					required
				/>
				<div
					class="tooltip"
					data-tip="Age must be between 18 and 120. If you are somehow 120 and using this website you have bigger things to worry about"
				>
					<p>&#9432;</p>
				</div>
			</div>
		</div>
		<div class="mb-4">
			<label for="Password" class="text-primary block text-sm font-medium">Password</label>
			<div class="flex items-center space-x-1">
				<input
					id="password"
					type="password"
					name="password"
					class="input input-bordered mt-1 w-full"
					placeholder="********"
					required
				/>
				<div
					class="tooltip"
					data-tip="Password must between 8 and 20 characters, contain at least one numeric digit, one uppercase and one lowercase letter"
				>
					<p>&#9432;</p>
				</div>
			</div>
		</div>
		<div class="mb-4">
			<label for="repeatPassword" class="text-primary block text-sm font-medium"
				>Repeat Password</label
			>
			<div class="flex items-center space-x-1">
				<input
					id="repeatpassword"
					type="password"
					name="repeatpassword"
					class="input input-bordered mt-1 w-full"
					placeholder="********"
					required
				/>
				<div
					class="tooltip"
					data-tip="Password must between 8 and 20 characters, contain at least one numeric digit, one uppercase and one lowercase letter"
				>
					<p>&#9432;</p>
				</div>
			</div>
		</div>
		<div class="align-center mb-4 flex justify-center">
			<p class="text-red-200">{form?.message ?? ''}</p>
		</div>
		<button formaction={'?/register'} type="submit" class="btn btn-secondary mb-4 w-full"
			>Register</button
		>
	</form>
</div>
