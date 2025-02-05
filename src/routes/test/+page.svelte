<script lang="ts">
  import type { PageData } from "./$types";

  //   let { data }: { data: PageData } = $props();

  let user = $props();
</script>

<div
  class="max-w-72 max-h-72 mr-20 ml-20 p-3 bg-gray-800 rounded-xl shadow-md flex flex-col justify-center items-center gap-3"
>
  <img
    src="https://i.ebayimg.com/images/g/HdYAAOSw8b1gSwfe/s-l1200.jpg"
    alt="profile"
    class="rounded-lg w-auto h-40"
  />
  <div class="w-full items-start">
    <div class="flex flex-row items-center gap-2">
      <p class="text-xl font-bold text-white">Luciita69</p>
      <p class="text-xl text-white">-</p>
      <p class="text-xl font-bold text-white">19</p>
    </div>
    <div class="flex flex-row mt-3 items-center gap-1">
      <svg
        viewBox="0 0 48 48"
        style="enable-background:new 0 0 512 512"
        class="w-6 mr-1"
        ><g
          ><path
            d="M14.42 35.17v5.53H8.95v2h5.46v5.05h2V42.7h5.46v-2h-5.46v-5.53c3.62-.29 6.79-2.15 8.85-4.89.6.09 1.19.14 1.79.14 3.16 0 6.31-1.2 8.71-3.6 4.57-4.57 4.78-11.85.67-16.69l6.47-6.47v7.43h2V1.25c0-.55-.45-1-1-1h-9.85v2h7.43l-6.47 6.47c-4.84-4.11-12.12-3.9-16.69.67-.41.41-.78.85-1.12 1.31-.59-.09-1.2-.15-1.82-.15-6.8 0-12.34 5.54-12.34 12.34.04 6.46 5.04 11.77 11.38 12.28zm5.35-24.37c2.01-2.01 4.66-3.02 7.3-3.02s5.29 1.01 7.3 3.02c4.03 4.03 4.03 10.58 0 14.6-2.17 2.17-5.08 3.16-7.92 2.99.83-1.66 1.31-3.53 1.31-5.51 0-5.41-3.51-10.01-8.36-11.67.12-.13.23-.27.37-.41zm-1.62 2.12c4.38 1.2 7.61 5.21 7.61 9.96 0 1.88-.52 3.65-1.4 5.17-1.68-.45-3.27-1.33-4.59-2.65-3.38-3.37-3.91-8.53-1.62-12.48zm-2.73-.37c.22 0 .43.02.64.03-2.31 4.62-1.55 10.39 2.29 14.24 1.38 1.38 3.02 2.36 4.76 2.94a10.293 10.293 0 0 1-7.7 3.46c-5.7 0-10.34-4.64-10.34-10.34s4.65-10.33 10.35-10.33z"
            fill="#ffffff"
            opacity="1"
            data-original="#000000"
            class=""
          /></g
        ></svg
      >
      <p class="text-lg mr-3">
        {user.gender ? "Hombre" : "Mujer"}
        {user.sexual_preferences}
      </p>
    </div>
    <div class="flex flex-row items-center gap-1">
      <svg
        class="w-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        ><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        /><g id="SVGRepo_iconCarrier">
          <path
            d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z"
            stroke="#ffffff"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z"
            stroke="#ffffff"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g></svg
      >
      <p class="text-lg mr-3">{user.location} (A Xkm)</p>
    </div>
  </div>
</div>
