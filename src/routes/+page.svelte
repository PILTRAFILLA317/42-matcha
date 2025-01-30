<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageServerData } from "./$types";
  import SearchIcon from "/src/assets/search.svg";
  import DoubleSlider from "../lib/components/DoubleSlider.svelte";

  let minAge = $state(18);
  let maxAge = $state(65);

  let { data }: { data: PageServerData } = $props();

  let Distance = $state(40);
</script>

<!-- <h1>Hi, {data.user.username}!</h1>
<p>Your user ID is {data.user.userId}.</p>
<form method="post" action="?/logout" use:enhance>
	<button>Sign out</button>
</form> -->

<div class="flex flex-col justify-center">
  <h1 class="text-3xl mb-7 font-bold">
    Encuentra el amor de tu vida o por lo menos córrete encima de alguien!!
  </h1>
  <div
    class="w-auto p-10 bg-white rounded-xl shadow-md flex flex-col items-start justify-center gap-10"
  >
    <div class="flex flex-col">
      <label for="range" class="text-lg text-black font-bold">Distancia</label>
      <input
        type="range"
        min="0"
        max="99"
        bind:value={Distance}
        class="range range-accent w-72"
      />
      <text class="text-lg text-black font-bold"
        >{Distance}{Distance === 99 ? "+" : ""} km</text
      >
    </div>
    <div class="flex flex-col gap-2">
      <label for="ageRange" class="text-lg text-black font-bold mb-2"
        >Rango de Edad</label
      >
      <div class="flex flex-row items-baseline gap-2">
        <!-- <input
          type="number"
          class="input w-16 validator"
          required
          placeholder="18"
          min="18"
          max="{ageRangeEnd}"
          bind:value={ageRangeStart}
          title="La edad debe ser entre 18 y 99"
        />
        <span class="text-lg text-black font-bold">-</span>
        <input
          type="number"
          class="input w-16 validator"
          required
          placeholder="99"
          min="{ageRangeStart}"
          max="99"
          bind:value={ageRangeEnd}
          title="La edad debe ser entre 18 y 99"
        />
        <text class="text-lg text-black font-bold">años</text> -->
      </div>
      <!-- <div> -->
       <div>
        <text class="text-lg text-black font-bold">Edad mínima: {minAge}</text>
        <text class="text-lg text-black font-bold">Edad maxima: {maxAge}</text>
       </div>
      <DoubleSlider
        bind:minValue={minAge}
        bind:maxValue={maxAge}
        min={18}
        max={100}
        class="w-96 mx-auto mt-8 bg-base-100 p-4 rounded-box shadow-lg"
      />
    </div>
    <div class="flex flex-row w-full justify-end items-center gap-4">
      <text class="text-lg text-black font-bold">¡Buscar!</text>
      <button class="btn justify-end"
        ><img src={SearchIcon} alt="Chat Icon" class="w-8" />
      </button>
    </div>
  </div>
</div>
