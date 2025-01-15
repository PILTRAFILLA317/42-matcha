<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";

  let { form }: { form: ActionData } = $props();

  let isLogin = $state(true);
</script>

<!-- <h1>Login/Register</h1>
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
	<button>Login</button>
	<button formaction="?/register">Register</button>
</form>
<p style="color: red">{form?.message ?? ''}</p> -->

<div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md ">
  <h2 class="text-2xl font-semibold text-center mb-4">
    {isLogin ? "Login" : "Register"}
  </h2>

  <form method="post" use:enhance>
    <!-- Campo de Username solo en el registro -->
    {#if !isLogin}
      <div class="mb-4">
        <label for="username" class="block text-sm font-medium text-gray-700"
          >Username</label
        >
        <input
          id="username"
          type="text"
          name="username"
          class="input input-bordered w-full mt-1"
          placeholder="Your username"
          required
        />
      </div>
      <div class="mb-4">
        <label for="firstname" class="block text-sm font-medium text-gray-700"
          >First Name</label
        >
        <input
          id="firstname"
          type="text"
          name="firstname"
          class="input input-bordered w-full mt-1"
          placeholder="Your firstname"
          required
        />
      </div>
      <div class="mb-4">
        <label for="lastname" class="block text-sm font-medium text-gray-700"
          >Last Name</label
        >
        <input
          id="lastname"
          type="text"
          name="lastname"
          class="input input-bordered w-full mt-1"
          placeholder="Your lastname"
          required
        />
      </div>
    {/if}

    <!-- Campo de Email -->
    <div class="mb-4">
      <label for="email" class="block text-sm font-medium text-gray-700"
        >Email</label
      >
      <input
        id="email"
        type="email"
        name="email"
        class="input input-bordered w-full mt-1"
        placeholder="you@example.com"
        required
      />
    </div>

    <!-- Campo de Password -->
    <div class="mb-4">
      <label for="password" class="block text-sm font-medium text-gray-700"
        >Password</label
      >
      <input
        id="password"
        type="password"
        name="password"
        class="input input-bordered w-full mt-1"
        placeholder="Your password"
        required
      />
    </div>

    <!-- Botón de submit -->
    <button
      formaction={isLogin ? "?/login" : "?/register"}
      type="submit"
      class="btn btn-primary w-full mb-4"
      >{isLogin ? "Login" : "Register"}</button
    >
  </form>

  <div class="text-center">
    <button
      class="text-sm text-blue-500 hover:underline"
      onclick={() => (isLogin = !isLogin)}
    >
      {isLogin
        ? "Don't have an account? Register"
        : "Already have an account? Login"}
    </button>
  </div>
</div>
