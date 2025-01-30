<script lang="ts">
    import type { PageData, PageLoad } from './$types';
    // import { env } from '$env/dynamic/private';

    let { data }: { data: PageData } = $props();
    let isLoading = $state(true);
    export const load = (async ({ params }) => {
	try {
		const res = await fetch(`/${params.mailReference}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mailReference: params.mailReference }),
            }
        );
		console.log(res);
		if (!res.ok) {
			return { error: res.statusText };
		}
        isLoading = false;
	} catch (error) {
		console.error(error);
	}
	return {};
}) satisfies PageLoad;


</script>

<div class="h-screen w-screen flex items-center justify-center bg-secondary">
    <div class="bg-slate-900 p-8 rounded-2xl shadow-lg text-center w-96">
        <h1 class="text-2xl font-bold mb-4">Email Verification</h1>
        {#if isLoading}
            <div class="flex justify-center">
                <span class="loading loading-spinner loading-lg"></span>
            </div>
        {:else}
            <p class="text-sm text-left text-slate-300">
                Email verification successful. You can now login to your account.
            </p>
        {/if}
    </div>
</div>