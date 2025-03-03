<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';


	let modal = $state(false);
	export const load = () => {
		console.log('onload??');
	};
</script>

<div data-sveltekit-preload-data="hover" class="bg-sky-900 mx-auto w-xl rounded-lg p-6 shadow-md">
	<h1 class="text-primary mb-4 text-center text-2xl font-semibold">Settings Page</h1>
	<ul class="menu rounded-box w-full">
		<li>
			<div class="breadcrumbs mb-4">
				<a href="settings/user" class="link link-hover">User Settings &gt;</a>
			</div>
		</li>
		<li>
			<div class="breadcrumbs mb-4">
				<a href="settings/password" class="link link-hover">Password Settings &gt;</a>
			</div>
		</li>
		<li>
			<div class="breadcrumbs mb-4">
				<a href="settings/pictures" class="link link-hover">Picture Settings &gt;</a>
			</div>
		</li>
	  </ul>
	<form method="post" use:enhance>
		<button formaction={'?/deleteUser'} type="submit" class="btn btn-primary w-full bg-red-500 hover:bg-red-600">
			Delete User
		</button>
	</form>
</div>
