<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<h1>Login/Register</h1>
<form method="post" action="?/login" use:enhance>
	<label>
		Username
		<input name="username" />
	</label>
	<label>
		Password
		<input type="password" name="password" />
	</label>
	<label>
		Email
		<input type="email" name="email" />
	</label>
	<label>
		First Name
		<input name="firstname" />
	</label>
	<label>
		Last Name
		<input name="lastname" />
	</label>
	<!-- <button>Login</button> -->
	<button formaction="?/register">Register</button>
</form>
<p style="color: red">{form?.message ?? ''}</p>
