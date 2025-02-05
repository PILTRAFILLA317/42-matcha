<script lang="ts">
  import RangeSlider  from "svelte-5-range-slider/RangeSlider.svelte";

  let thumb1 = 25;
  let thumb2 = 50;

  const trackOptions = {
    height: 12,
    color: "#323841",
    radius: 10000,
    connecting: {
      color: "#ECF9FF",
      padding: 4,
      radius: 100000,
    },
  };

  const thumbOptions = {
    color: "#1D232A",
    size: 16,
    radius: 20,
  };

  const sliderOptions = {
    min: 18,
    max: 90,
    step: 1,
  };
</script>

<div class="slider-container w-72">
  <span>{thumb1} - {thumb2}</span>
  <RangeSlider
    bind:thumb1
    bind:thumb2
    {sliderOptions}
    {trackOptions}
    {thumbOptions}
  />
</div>