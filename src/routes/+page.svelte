<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageServerData } from "./$types";
  import SearchIcon from "/src/assets/search.svg";
  import DoubleSlider from "../lib/components/DoubleSlider.svelte";
  import { onMount } from "svelte";
  
  let { data }: { data: PageServerData } = $props();
  let minAge = $state(18);
  let maxAge = $state(65);

  let minFR = $state(0);
  let maxFR = $state(1000);


  let Distance = $state(40);

  let clickedTags = $state([]);

  let tag = $state({
    id: "",
    preference: "",
    clicked: false,
  });

  let tags = $state([tag]);

  function handleTagClick(tag) {
    console.log("Tag clicked: ");
    console.log(tag.id);
    if (tag.clicked) {
      clickedTags = clickedTags.filter((clickedTag) => clickedTag !== tag.id);
    } else {
      clickedTags = [...clickedTags, tag.id];
    }
    console.log("Clicked tags: ");
    console.log(clickedTags);
    tag.clicked = !tag.clicked;
  }

  async function getAllTags() {
    try {
      const res = await fetch("../api/get-tags");
      const data = await res.json();

      if (res.ok) {
        console.log("DATA: ");
        console.log(data);
        tags = data;
      } else {
        console.log("Error al obtener los tags.");
      }
    } catch (err) {
      console.log("Error al obtener los tags.");
    }
  }

  onMount(() => {
    getAllTags();
  });
</script>

<!-- <h1>Hi, {data.user.username}!</h1>
<p>Your user ID is {data.user.userId}.</p>
<form method="post" action="?/logout" use:enhance>
	<button>Sign out</button>
</form> -->

<div class="flex flex-col items-center justify-center">
  <h1 class="text-3xl mb-7 font-bold">¡Encuentra el amor de tu vida!</h1>
  <div
    class="w-auto mr-20 ml-20 p-10 bg-white rounded-xl shadow-md flex flex-col items-start justify-center gap-10"
  >
    <div class="flex w-full justify-between items-baseline gap-10">
      <div>
        <div class="flex flex-col">
          <label for="range" class="text-lg mb-5 text-black font-bold"
            >Distancia</label
          >
          <input
            type="range"
            min="0"
            max="99"
            bind:value={Distance}
            class="range range-accent w-full"
          />
          <text class="text-lg text-black"
            >{Distance}{Distance === 99 ? "+" : ""} km</text
          >
        </div>
        <div class="flex flex-col">
          <label for="ageRange" class="text-lg text-black mt-10 mb-5 font-bold mb-2"
            >Rango de Edad</label
          >
          <!-- <div> -->
          <div class="flex flex-col">
            <text class="text-lg text-black "
              >Edad mínima: {minAge}</text
            >
            <text class="text-lg text-black "
              >Edad maxima: {maxAge}</text
            >
          </div>
          <DoubleSlider
            bind:minValue={minAge}
            bind:maxValue={maxAge}
            min={18}
            max={99}
            class="w-96 mx-auto"
          />
        </div>
      </div>
      <div class="divider divider-neutral divider-horizontal" />
      <div class="flex flex-col items-start justify-baseline w-1/2">
        <label for="range" class="text-lg text-black font-bold flex gap-3"
          >Fame Rating
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="220.0741 46.564 161.7344 209.9264"
            class="w-6"
          >
            <g />
            <g
              transform="matrix(11.55245590209961, 0, 0, 11.046404838562012, 162.3118438720703, 13.46955871582032)"
              style=""
            >
              <path
                d="M 12 22 C 10.1 22 8.4 21.3 7.1 19.9 C 5.7 18.6 5 16.9 5 15 C 5 13 5.9 10.7 7.3 9.3 L 7.4 9.2 C 8.6 8 10 6.5 10 4 C 10 3.6 10.2 3.2 10.6 3.1 C 11 2.9 11.4 3 11.7 3.3 C 12.9 4.5 15.182 7.364 13.782 10.664 C 13.982 10.664 14.1 11.3 15.2 9.5 C 15.3 9.2 15.6 9 15.9 9 C 16.2 9 16.5 9.1 16.7 9.3 C 17.8 10.5 19 13.1 19 15 C 19 16.9 18.3 18.6 16.9 19.9 C 15.6 21.3 13.9 22 12 22 Z"
                fill="#fd7e89"
                opacity="1"
                data-original="#000000"
                class=""
              />
            </g>
          </svg>
        </label>
        <div class="flex flex-col mt-5">
          <text class="text-lg text-black"
            >Fame Rating mínimo: {minFR}</text
          >
          <text class="text-lg text-black"
            >Fame Rating máximo: {maxFR}</text
          >
        </div>
        <DoubleSlider
          bind:minValue={minFR}
          bind:maxValue={maxFR}
          min={0}
          max={1000}
          class="w-96"
        />
        <div class="flex flex-col gap-3 mt-5">
          <text class="text-lg text-black font-bold">Gustos</text>
          <div class="flex flex-wrap gap-2">
            {#each tags as tag}
              <div class="flex items-center gap-2">
                <div
                  class="badge w-auto h-8 text-white badge-secondary cursor-pointer {tag.clicked
                    ? ''
                    : 'badge-outline'}"
                  onclick={() => handleTagClick(tag)}
                >
                  {tag.preference}
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-row w-full justify-end items-center gap-4">
      <text class="text-lg text-black font-bold">¡Buscar!</text>
      <button class="btn justify-end"
        ><img src={SearchIcon} alt="Chat Icon" class="w-8" />
      </button>
    </div>
  </div>
</div>
