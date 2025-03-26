<script lang="ts">
	import { formToJSON } from 'axios';
    import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';

    let { data, form }: { data: PageData, form: ActionData } = $props();
</script>

<div class="hero min-h-[80vh]">
    <div class="hero-content flex-col md:flex-row">
      <img
        alt="perrong"
        src="/assets/perrong.png"
        class="rounded-lg shadow-2xl" />
      <div>
        <h1 class="text-3xl md:text-5xl font-bold">Please Verify your email</h1>
        <p class="py-6 text-xs">
          In order to use our services you need to verify your email address.<br />
          Check your inbox for a verification email. If it's not in your inbox please check your spam folder.<br />
            If you haven't recived the verification email please click the button below to resend it.<br />
        </p>
        <form use:enhance method="POST">
            <button formaction={'?/sendEmail'} class="btn btn-secondary">Send email</button>
        </form>
        {#if form?.status === 200}
          <p class="text-green-500">{form?.message ?? ''}</p>
        {:else}
          <p class="text-red-500">{form?.message ?? ''}</p>
        {/if}
      </div>
    </div>
  </div>