<script lang="ts">
    import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	console.log("Form is: ", form);
</script>

<div class="flex:column  bg-sky-900 items-center w-md mx-auto rounded-lg p-6 shadow-md ">
	<h2 class="mb-4 text-center text-2xl font-semibold text-primary">
		Register
	</h2>

	<form method="post" use:enhance>
		<div class="mb-4">
			<label for="email" class="block text-sm font-medium text-primary">Email</label>
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
			<label for="username" class="block text-sm font-medium text-primary">Username</label>
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
			<label for="FirstName" class="block text-sm font-medium text-primary">First Name</label>
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
			<label for="LastName" class="block text-sm font-medium text-primary">Last Name</label>
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
			<label for="Age" class="block text-sm font-medium text-primary">Age</label>
			<div class="flex items-center space-x-1">
			<input
				id="age"
				type="number"
				name="age"
				class="input input-bordered mt-1 w-full"
				placeholder="Your Age"
				required
			/>
			<div class="tooltip" data-tip="Age must be between 18 and 120. If you are somehow 120 and using this website you have bigger things to worry about">
				<p>&#9432;</p>
			</div>
			</div>
		</div>
		<div class="mb-4">
			<label for="Password" class="block text-sm font-medium text-primary">Password</label>
			<div class="flex items-center space-x-1">
				<input
				id="password"
				type="password"
				name="password"
				class="input input-bordered mt-1 w-full"
				placeholder="********"
				required
				/>
				<div class="tooltip" data-tip="Password must between 8 and 20 characters, contain at least one numeric digit, one uppercase and one lowercase letter">
					<p>&#9432;</p>
				</div>
			</div>
		</div>
		<div class="mb-4">
			<label for="repeatPassword" class="block text-sm font-medium text-primary">Repeat Password</label>
			<div class="flex items-center space-x-1">
			<input
			id="repeatpassword"
			type="password"
			name="repeatpassword"
			class="input input-bordered mt-1 w-full"
			placeholder="********"
			required
			/>
			<div class="tooltip" data-tip="Password must between 8 and 20 characters, contain at least one numeric digit, one uppercase and one lowercase letter">
				<p>&#9432;</p>
			</div>
			</div>
		</div>
		<div class="flex mb-4 align-center justify-center">
			<p class="text-red-200">{form?.message ?? ''}</p>
		</div>
		<button
			formaction={'?/register'}
			type="submit"
			class="btn btn-secondary mb-4 w-full">Register</button
		>
	</form>
</div>
