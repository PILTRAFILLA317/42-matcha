<script lang="ts">
  import type {
    SliderOptions,
    ThumbOptions,
    TrackOptions,
  } from "$lib/doubleThumbSlider";
  import DoubleThumbSlider from "$lib/DoubleThumbSlider.svelte";
  let thumb1 = $state(25);
  let thumb2 = $state(50);

  const trackOptions: TrackOptions = {
    height: 12,
    color: "#323841",
    radius: 10000,
    connecting: {
      color: "#ECF9FF",
      padding: 4,
      radius: 100000,
    },
  };

  const thumbOptions: ThumbOptions = {
    color: "#1D232A",
    size: 16,
    radius: 20,
  };

  const sliderOptions: SliderOptions = {
    min: 18,
    max: 90,
    step: 1,
  };
</script>

<div class="flex h-screen w-screen bg-base-200">
  <div class="flex flex-col m-auto w-96 gap-6">
    <Slider
      bind:thumb1
      bind:thumb2
      {sliderOptions}
      {trackOptions}
      {thumbOptions}
    />
    <DoubleThumbSlider
      bind:thumb1
      bind:thumb2
      {sliderOptions}
      {trackOptions}
      {thumbOptions}
    />
  </div>
</div>
