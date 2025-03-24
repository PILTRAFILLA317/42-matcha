<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
    import TrashCan from '$lib/components/common/TrashCan.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
    const iconSize = 3;
	const tags = [
		'BDSM',
		'pegging',
		'raw-dogging',
		'PEC',
		'foot-fetishism',
		'gambling',
		'drunk-driving',
		'alcoholism',
		'schizophrenia',
		'ADHD',
		'league-player',
		'emo',
		'goth',
		'furry',
		'punk',
		'jordi-moderfukin-wild',
		'tattoos',
		'piercings',
		'smoking',
		'rave'
	];

    function handleUpload(node: HTMLFormElement) {
		// console.log('Upload result:', node);
	}
	export const load = () => {};
</script>

<!-- svelte-ignore binding_property_non_reactive -->
<div class="flex items-center p-8">
	<div
		data-sveltekit-preload-data="hover"
		class="shadow-neutral mx-auto flex max-w-xl flex-col rounded-lg bg-sky-900 p-6 shadow-md"
	>
		<div class="mb-4 flex flex-row items-center justify-between">
			<a
				href="/settings"
				class="relative flex-none pt-1 text-white hover:text-gray-300"
				aria-label="Back to settings"
			>
				<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
					><path fill="currentColor" d="M10 22L0 12L10 2l1.775 1.775L3.55 12l8.225 8.225z" /></svg
				>
			</a>
			<h1 class="text-primary mb-4 flex-1 text-center text-2xl font-semibold">Complete Profile</h1>
		</div>
		<!-- svelte-ignore a11y_missing_attribute -->
		<div class="border-opacity-50 flex w-full flex-col">
		{#if data.images}
			<div class="carousel w-full">
				{#each data.images as image, index}
					<div id="item{index}" class="carousel-item relative object-cover w-full h-[600px] flex-shrink-0 overflow-hidden">
						<img src={image} class="w-full" />
						<form use:enhance method="post">
							<button
								class="absolute top-2 right-2 rounded-full p-2 size-{iconSize}"
								formAction="?/deletePicture&id={index}"
							>
								<TrashCan classData="w-15 h-15 hover:h-25" />
							</button>
						</form>
					</div>
				{/each}
			</div>
			{/if}
			<div class="flex w-full justify-center gap-2 py-2">
				{#each data.images as image, index}
					<a href="#item{index}" class="btn btn-xs">{index + 1}</a>
				{/each}
			</div>
			<div class="divider">Upload a new Image</div>
			<div class="flex w-full items-center justify-center">
				<form
					use:enhance={handleUpload}
					action="?/uploadPicture"
					method="post"
					class="w-full"
					enctype="multipart/form-data"
				>
					<input type="file" name="file" class="file-input w-full" />
					<button type="submit" class="btn btn-grey mt-4 w-full">Upload</button>
				</form>
			</div>
		</div>
		<div class="align-center mb-4 flex justify-center">
			<p class="text-white">{form?.message ?? ''}</p>
		</div>
		<form method="post" use:enhance>
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
			<div class="mb-4 flex w-full flex-wrap gap-2">
				{#each tags as tag, i}
					<label class="badge badge-secondary badge-outline h-8 w-auto text-white">
						<input
							type="checkbox"
							name="tags"
							value={i}
							bind:checked={() => data.user.userPreferences?.map(String).includes(tag), () => true}
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
