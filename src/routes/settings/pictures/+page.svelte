<script lang="ts">
	import { enhance } from '$app/forms';
	import TrashCan from '$lib/components/common/TrashCan.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const iconSize = 3;

	function handleUpload(node: HTMLFormElement) {
		console.log('Upload result:', node);
	}
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<div class="bg-primary mx-auto w-xl rounded-lg p-6 shadow-md">
	<div class="border-opacity-50 flex w-full flex-col">
		<div class="carousel w-full">
			{#each data.images as image, index}
				<div id="item{index}" class="carousel-item relative w-full">
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
</div>
