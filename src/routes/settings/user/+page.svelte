<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const tags = ["BDSM", "pegging", "raw-dogging", "PEC", "foot-fetishism", "gambling", "drunk-driving", "alcoholism", "schizophrenia", "ADHD", "league-player", "emo", "goth", "furry", "punk", "jordi-moderfukin-wild", "tattoos", "piercings", "smoking", "rave"]
	export const load = () => {
	};
</script>

<!-- svelte-ignore binding_property_non_reactive -->
<div class="flex h-screen w-screen items-center">
	<div data-sveltekit-preload-data="hover" class="mx-auto w-xl rounded-lg bg-sky-900 p-6 shadow-md">
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
			<h1 class="text-primary mb-4 flex-1 text-center text-2xl font-semibold">User Settings</h1>
		</div>
		<form method="post" use:enhance>
			<div class="mb-4">
				<label for="username" class="text-primary block text-sm font-medium">Username</label>
				<input
					id="username"
					type="text"
					name="username"
					class="input input-bordered mt-1 w-full"
					placeholder="Your Username"
					bind:value={data.user.username}
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
					bind:value={data.user.firstName}
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
					bind:value={data.user.lastName}
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
				<select
					name="sexual_preferences"
					class="select select-bordered w-full max-w-xs"
					bind:value={data.user.sexualPreferences}
				>
					<option disabled value={null}> Select your sexual preference? </option>
					<option value="Heterosexual">Heterosexual</option>
					<option value="Homosexual">Homosexual</option>
					<option value="Bisexual">Bisexual</option>
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
					bind:value={data.user.bio}
				></textarea>
			</div>
			<div class="mb-4 flex flex-wrap w-full gap-2">
				{#each tags as tag, i}
					<label class="badge badge-secondary badge-outline h-8 w-auto text-white">
						<input
							type="checkbox"
							name="tag{i}"
							value={tag}
							checked={data.user.userPreferences?.includes(i)}
						/>
						<span>{tag}</span>
					</label>
				{/each}
			</div>
			<button formaction={'?/updateUser'} type="submit" class="btn btn-primary w-full">
				Save Changes
			</button>
		</form>
		<div class="h-4">
			{#if form?.message == 'User updated successfully'}
				<div class="text-center text-green-500">{form.message}</div>
			{:else}
				<div class="text-center text-red-500">{form?.message ?? ''}</div>
			{/if}
		</div>
	</div>
</div>
