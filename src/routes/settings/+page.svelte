<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from '../$types';

	let modal: HTMLDialogElement | null = $state(null);
	let { form }: { form: ActionData } = $props();
	// export const load = () => {
	// 	console.log('onload??');
	// };
</script>

<div data-sveltekit-preload-data="hover" class="mx-auto w-xl rounded-lg bg-sky-900 p-6 shadow-md">
	<h1 class="text-primary mb-4 text-center text-2xl font-semibold">Settings Page</h1>
	<ul class="menu rounded-box w-full">
		<li>
			<a href="settings/user" class="breadcrumbs mb-4"> 👤&emsp;&emsp;User Settings </a>
		</li>
		<li>
			<a href="settings/password" class="breadcrumbs mb-4">🔐&emsp;&emsp;Password Settings</a>
		</li>
		<li>
			<a href="settings/pictures" class="breadcrumbs mb-4">🖼️&emsp;&emsp;Picture Settings</a>
		</li>
		<li>
			<a href="settings/email" class="breadcrumbs mb-4">✉️&emsp;&emsp;Email Settings</a>
		</li>
		<li>
			<a href="settings/location" class="breadcrumbs mb-4">🌍&emsp;&emsp;Location Settings</a>
		</li>
	</ul>
	<!-- svelte-ignore event_directive_deprecated -->
	<button
		class="btn btn-primary w-full bg-red-500 hover:bg-red-600"
		onclick={() => modal?.showModal()}>Delete User</button
	>
	<dialog bind:this={modal} class="modal modal-bottom sm:modal-middle">
		<div class="modal-box">
			<h3 class="text-lg font-bold">Do you really want to delete the User?</h3>
			<h1 class="text-red-400">{form?.message ?? ''}</h1>
			<div class="modal-action">
				<form method="post" use:enhance>
					<button
						formaction={'?/deleteUser'}
						type="submit"
						class="btn btn-primary w-full bg-red-500 hover:bg-red-600"
					>
						Delete User
					</button>
				</form>
				<form method="dialog">
					<button class="btn">Close</button>
				</form>
			</div>
		</div>
	</dialog>
</div>
