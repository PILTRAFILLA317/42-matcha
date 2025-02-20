<script lang="ts">
    import type { PageData } from './$types';
    let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-col items-center gap-7 justify-center">
    <h1 class="text-4xl font-bold">Welcome {data.user.username}!</h1>
    <p class="text-lg mt-4">This is the main page.</p>

    <div class="flex flex-row items-center gap-8">
        <button class="btn btn-xs sm:btn-sm btn-primary md:btn-md lg:btn-lg xl:btn-xl">Descubrir</button>
        <button class="btn btn-xs sm:btn-sm btn-primary md:btn-md lg:btn-lg xl:btn-xl" onclick={() => window.location.href = '/search'}>Buscar</button>
        <button class="btn btn-xs sm:btn-sm btn-primary md:btn-md lg:btn-lg xl:btn-xl" onclick={() => window.location.href = '/chat'}>Chat</button>
    </div>
</div>
