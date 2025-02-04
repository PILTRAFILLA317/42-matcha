<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';


	
	let { data, form }: { data: PageData, form: ActionData } = $props();
	export const load = () => {
		console.log('onload??');
	};
</script>

<div class="mx-auto w-xl rounded-lg bg-secondary p-6 shadow-md">
	<h1 class="mb-4 text-center text-2xl font-semibold text-primary">Settings Page</h1>
	<form method="post" use:enhance>
		<div class="mb-4">
			<label for="email" class="block text-sm font-medium text-primary">Email</label>
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
		<div class="mb-4">
			<label for="username" class="block text-sm font-medium text-primary">Username</label>
			<input
				id="username"
				type="text"
				name="username"
				class="input input-bordered mt-1 w-full"
				placeholder="Your Username"
				value={data.user.username}
				required
			/>
		</div>
		<div class="mb-4">
			<label for="firstName" class="block text-sm font-medium text-primary">First Name</label>
			<input
				id="firstName"
				type="text"
				name="firstname"
				class="input input-bordered mt-1 w-full"
				value={data.user.firstName}
				placeholder="Your First Name"
				required
			/>
		</div>
		<div class="mb-4">
			<label for="lastName" class="block text-sm font-medium text-primary">Last Name</label>
			<input
				id="lastName"
				type="text"
				name="lastname"
				class="input input-bordered mt-1 w-full"
				value={data.user.lastName}
				placeholder="Your Last Name"
				required
			/>
		</div>
		<div class="mb-4">
			<label for="gender" class="block text-sm font-medium text-primary">Gender</label>
			<select name="gender" class="select select-bordered w-full max-w-xs">
				<option disabled selected={data.user.gender == null}>Select your gender?</option>
				<option selected={data.user.gender && data.user.gender != null}>Male</option>
				<option selected={!data.user.gender && data.user.gender != null}>Female</option>
			</select>
		</div>
		<div class="mb-4">
			<label for="sexualPreference" class="block text-sm font-medium text-primary">
				Sexual Preference
			</label>
			<select name="sexualpreference" class="select select-bordered w-full max-w-xs">
				<option disabled selected={data.user.sexualPreference == null}>
					Select your sexual preference?
				</option>
				<option selected={data.user.sexualPreference?.toString() == "Homosexual"}>Homosexual</option>
				<option selected={data.user.sexualPreference?.toString() == "Heterosexual"}>Heterosexual</option>
				<option selected={data.user.sexualPreference?.toString() == "Bisexual"}>Bisexual</option>
			</select>
		</div>
		<div class="mb-4">
			<label for="bio" class="block text-sm font-medium text-primary">Bio</label>
			<textarea
				id="bio"
				name="bio"
				class="textarea textarea-bordered w-full"
				placeholder="Write you biography here"
				maxlength="500"
				value={data.user.bio}
			></textarea>
		</div>
		<button formaction={'?/updateUser'} type="submit" class="btn btn-primary w-full">
			Save Changes
		</button>
		<div class="h-4"></div>
		<button formaction={'?/deleteUser'} type="submit" class="btn btn-primary w-full">
			Delete User
		</button>
	</form>
	<div class="h-4">
		<div class="text-center text-red-500">{form?.message ?? ''}</div>
	</div>
</div>
