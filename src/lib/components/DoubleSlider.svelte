<!-- src/lib/DoubleSlider.svelte -->
<script lang="ts">
  import { derived } from "svelte/store";

  let {
    class: clazz = "w-2/3 p-4",
    minValue = $bindable(0),
    maxValue = $bindable(99),
    min = 0,
    max = 100,
  }: {
    className?: string;
    class?: string;
    minValue?: number;
    maxValue?: number;
    min?: number;
    max?: number;
  } = $props();

  let sliderElement = $state(null);
  let activeThumb = $state(null);
  let sliderWidth = $state(0);
  let sliderLeft = $state(0);

  let minPosition = $derived(((minValue - min) / (max - min)) * 100);
  let maxPosition = $derived(((maxValue - min) / (max - min)) * 100);

  function updateBounds() {
    if (!sliderElement) return;
    const rect = sliderElement.getBoundingClientRect();
    sliderWidth = rect.width;
    sliderLeft = rect.left;
  }

  function handleInput(e, type) {
    activeThumb = type;
    updateBounds();
    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("mouseup", releaseHandler);
    window.addEventListener("touchmove", moveHandler, { passive: false });
    window.addEventListener("touchend", releaseHandler);
  }

  function moveHandler(e) {
    if (!activeThumb || !sliderElement) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const percentage = Math.min(
      1,
      Math.max(0, (clientX - sliderLeft) / sliderWidth)
    );
    const newValue = Math.round(min + (max - min) * percentage);

    if (activeThumb === "min") {
      minValue = Math.min(Math.max(newValue, min), maxValue);
    } else {
      maxValue = Math.max(Math.min(newValue, max), minValue);
    }
  }

  function releaseHandler() {
    activeThumb = null;
    window.removeEventListener("mousemove", moveHandler);
    window.removeEventListener("mouseup", releaseHandler);
    window.removeEventListener("touchmove", moveHandler);
    window.removeEventListener("touchend", releaseHandler);
  }

  function getClosestThumb(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const minDiff = Math.abs(
      clientX - (sliderLeft + (sliderWidth * minPosition) / 100)
    );
    const maxDiff = Math.abs(
      clientX - (sliderLeft + (sliderWidth * maxPosition) / 100)
    );
    return minDiff < maxDiff ? "min" : "max";
  }

  $effect(() => {
    // Ensure values stay within bounds
    minValue = Math.max(min, Math.min(minValue, maxValue));
    maxValue = Math.min(max, Math.max(maxValue, minValue));
    updateBounds();
  });
</script>

<div class={clazz}>
  <div class="form-control">
    <!-- <label class="label">
            <span class="label-text">Age Range</span>
            <span class="label-text-alt">{minValue} - {maxValue}</span>
        </label> -->

    <div
      bind:this={sliderElement}
      class="slider-container mr-3 ml-3 relative h-12 touch-none"
      on:mousedown|preventDefault={(e) => handleInput(e, getClosestThumb(e))}
      on:touchstart|preventDefault={(e) => handleInput(e, getClosestThumb(e))}
    >
      <!-- Visual track -->
      <div
        class="bg-accent absolute top-1/2 h-1/4 w-full -translate-y-1/2 rounded-full opacity-10"
      />

      <!-- Active range -->
      <div
        class="bg-accent absolute top-1/2 h-1/2 -translate-y-1/2 rounded-full"
        style="left: {minPosition - 3.5}%; right: {96.5 - maxPosition}%"
      />

      <!-- Interactive Thumbs -->
      <div
        class="translate-x-[-50%] bg-emerald-900 border-transparent absolute top-1/2 z-40 h-4 w-4 -translate-y-1/2 cursor-pointer rounded-full border-2
                       shadow transition-transform duration-100 hover:scale-110"
        style="left: {minPosition}%"
        on:mousedown|stopPropagation={() => handleInput(event, "min")}
        on:touchstart|stopPropagation={() => handleInput(event, "min")}
      />
      <div
        class="translate-x-[-50%] bg-emerald-900 border-transparent absolute top-1/2 z-40 h-4 w-4 -translate-y-1/2 cursor-pointer rounded-full border-2
                       shadow transition-transform duration-100 hover:scale-110"
        style="left: {maxPosition}%"
        role="application"
        on:mousedown|stopPropagation={() => handleInput(event, "max")}
        on:touchstart|stopPropagation={() => handleInput(event, "max")}
      />
    </div>
  </div>
</div>

<style>
  .slider-container {
    user-select: none;
    -webkit-user-select: none;
    touch-action: none;
  }
</style>
