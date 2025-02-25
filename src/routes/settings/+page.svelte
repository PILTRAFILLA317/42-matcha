<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	export const load = () => {
		console.log('onload??');
	};
</script>

<div data-sveltekit-preload-data="hover" class="bg-secondary mx-auto w-xl rounded-lg p-6 shadow-md">
	<h1 class="text-primary mb-4 text-center text-2xl font-semibold">Settings Page</h1>
	<div class="breadcrumbs mb-4">
		<a href="settings/password" class="link link-hover">Change password &gt;</a>
	</div>
	<div class="breadcrumbs mb-4">
		<a href="settings/pictures" class="link link-hover">Change pictures &gt;</a>
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
		<div class="mb-4">
			<label for="username" class="text-primary block text-sm font-medium">Username</label>
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
			<label for="firstName" class="text-primary block text-sm font-medium">First Name</label>
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
			<label for="lastName" class="text-primary block text-sm font-medium">Last Name</label>
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
			<label for="gender" class="text-primary block text-sm font-medium">Gender</label>
			<select name="gender" class="select select-bordered w-full max-w-xs">
				<option disabled selected={data.user.gender == null}>Select your gender?</option>
				<option selected={data.user.gender && data.user.gender != null}>Male</option>
				<option selected={!data.user.gender && data.user.gender != null}>Female</option>
			</select>
		</div>
		<div class="mb-4">
			<label for="sexualPreference" class="text-primary block text-sm font-medium">
				Sexual Preference
			</label>
			<select name="sexual_preferences" class="select select-bordered w-full max-w-xs">
				<option disabled selected={data.user.sexualPreferences == null}>
					Select your sexual preference?
				</option>
				<option selected={data.user.sexualPreferences?.toString() == 'Homosexual'}
					>Homosexual</option
				>
				<option selected={data.user.sexualPreferences?.toString() == 'Heterosexual'}
					>Heterosexual</option
				>
				<option selected={data.user.sexualPreferences?.toString() == 'Bisexual'}>Bisexual</option>
			</select>
		</div>
		<div class="mb-4">
			<label for="bio" class="text-primary block text-sm font-medium">Bio</label>
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
