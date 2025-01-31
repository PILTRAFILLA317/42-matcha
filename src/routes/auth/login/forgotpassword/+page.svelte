<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="mx-auto max-w-md rounded-lg bg-primary p-6 shadow-md">
	<h2 class="mb-4 text-center text-2xl text-secondary">Recover Password</h2>
	<form method="post" use:enhance>
		<div class="mb-4">
			<input
				id="email"
				type="email"
				name="email"
				class="input input-bordered mt-1 w-full bg-white text-black"
				placeholder="Account Email"
				required
			/>
        </div>
        <div>
            <button formaction={'?/recover'} type="submit" class="btn btn-secondary mb-4 w-full">
                Send email
            </button>
        </div>
        <div>
            <img alt="monkey sad" src="https://media1.tenor.com/m/A6Z5yVoAz-wAAAAd/monkey-oh-no.gif"/>
        </div>
	</form>
</div>
