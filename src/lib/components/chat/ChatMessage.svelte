<script lang="ts">
	export let user: User;
	export let sender: string;
    export let message: string;
</script>


{#if user.username == sender}
	<div class="chat chat-end">
		<div class="chat-header">
			{sender}
		</div>
		<div class="chat-bubble">
			{message}
		</div>
	</div>
	{:else}
	<div class="chat chat-start">
		<div class="chat-header">
			{sender}
		</div>
		<div class="chat-bubble bg-blue-600">
            {message}
        </div>
	</div>
{/if}
