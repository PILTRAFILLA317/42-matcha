<!-- src/lib/DoubleSlider.svelte -->
<script>
    export let className = "w-2/3 p-4";
    export let minValue = 0;
    export let maxValue = 100;
    export let min = 0;
    export let max = 100;

    let sliderElement;
    let activeThumb = null;
    let sliderWidth = 0;
    let sliderLeft = 0;

    function updateBounds() {
        if (!sliderElement) return;
        const rect = sliderElement.getBoundingClientRect();
        sliderWidth = rect.width;
        sliderLeft = rect.left;
    }

    function handleInput(e, type) {
        activeThumb = type;
        updateBounds();
        window.addEventListener('mousemove', moveHandler);
        window.addEventListener('mouseup', releaseHandler);
        window.addEventListener('touchmove', moveHandler, { passive: false });
        window.addEventListener('touchend', releaseHandler);
    }

    function moveHandler(e) {
        if (!activeThumb || !sliderElement) return;
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const percentage = Math.min(1, Math.max(0, (clientX - sliderLeft) / sliderWidth));
        const newValue = Math.round(min + (max - min) * percentage);

        if (activeThumb === 'min') {
            minValue = Math.min(Math.max(newValue, min), maxValue);
        } else {
            maxValue = Math.max(Math.min(newValue, max), minValue);
        }
    }

    function releaseHandler() {
        activeThumb = null;
        window.removeEventListener('mousemove', moveHandler);
        window.removeEventListener('mouseup', releaseHandler);
        window.removeEventListener('touchmove', moveHandler);
        window.removeEventListener('touchend', releaseHandler);
    }

    function getClosestThumb(e) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const minDiff = Math.abs(clientX - (sliderLeft + (sliderWidth * minPosition / 100)));
        const maxDiff = Math.abs(clientX - (sliderLeft + (sliderWidth * maxPosition / 100)));
        return minDiff < maxDiff ? 'min' : 'max';
    }

    $: minPosition = ((minValue - min) / (max - min)) * 100;
    $: maxPosition = ((maxValue - min) / (max - min)) * 100;
    
    $: {
        // Ensure values stay within bounds
        minValue = Math.max(min, Math.min(minValue, maxValue));
        maxValue = Math.min(max, Math.max(maxValue, minValue));
        updateBounds();
    }
</script>

<div class={className}>
    <div class="form-control">
        <label class="label">
            <span class="label-text">Age Range</span>
            <span class="label-text-alt">{minValue} - {maxValue}</span>
        </label>
        
        <div 
            bind:this={sliderElement}
            class="relative h-12 slider-container touch-none"
            on:mousedown|preventDefault={(e) => handleInput(e, getClosestThumb(e))}
            on:touchstart|preventDefault={(e) => handleInput(e, getClosestThumb(e))}
        >
            <!-- Visual track -->
            <div class="absolute w-full top-1/2 -translate-y-1/2 h-2 bg-base-300 rounded-full" />
            
            <!-- Active range -->
            <div 
                class="absolute top-1/2 -translate-y-1/2 h-2 bg-primary rounded-full"
                style="left: {minPosition}%; right: {100 - maxPosition}%"
            />
            
            <!-- Interactive Thumbs -->
            <div 
                class="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-primary rounded-full shadow border-2 border-primary-content cursor-pointer 
                       hover:scale-110 transition-transform duration-100 z-40"
                style="left: {minPosition}%"
                on:mousedown|stopPropagation={() => handleInput(event, 'min')}
                on:touchstart|stopPropagation={() => handleInput(event, 'min')}
            />
            <div 
                class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-primary rounded-full shadow border-2 border-primary-content cursor-pointer 
                       hover:scale-110 transition-transform duration-100 z-40"
                style="left: {maxPosition}%"
                on:mousedown|stopPropagation={() => handleInput(event, 'max')}
                on:touchstart|stopPropagation={() => handleInput(event, 'max')}
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