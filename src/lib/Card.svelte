<script>
  import { invoke } from "@tauri-apps/api/tauri"

  export let action;
  export let src;
  export let selection = false;

  async function on_exit(action) {
    await invoke("on_exit", { action });
  }
</script>

<div class="cont">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class={selection ? "image bg-[#313244]" : "image"} role="button" tabindex="0" on:click={() => on_exit(action)}>
    <img src={src} alt={action} class="p-[12%]" draggable="false" />
  </div>
  <div class="mt-[1vw] text-[#9399b2] mx-auto text-2xl font-normal">
    {action.charAt(0).toUpperCase() + action.slice(1)}
  </div>
</div>

<style>
.cont { @apply grid flex flex-col; }
.image { @apply w-[9.6vw] aspect-square rounded-full mx-auto; }
.image:hover { @apply bg-[#313244] cursor-pointer; }
</style>
