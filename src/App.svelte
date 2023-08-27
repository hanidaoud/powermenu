<script>
  import { register } from '@tauri-apps/api/globalShortcut';
  import { invoke } from "@tauri-apps/api/tauri";
  import Card from './lib/Card.svelte';
  import user from './assets/user.svg';
  import sleep from './assets/sleep.svg';
  import hibernate from './assets/hibernate.svg';
  import restart from './assets/restart.svg';
  import shutdown from './assets/shutdown.svg';
  import logout from './assets/logout.svg';

  let counter = 30;
  let interaction = false;
  let selection = 1;
  let name;
  const actions = ["sleep", "hibernate", "restart", "shutdown", "logout"];
  const srcs = [sleep, hibernate, restart, shutdown, logout];

  get_user();
  show_main_window();
  register_shortcuts();

  $: if (!interaction && counter) setTimeout(() => counter--, 1000);
  $: if (!(interaction || counter)) on_exit("sleep");

  async function get_user() {
    name = await invoke("get_user");
  }

  async function show_main_window() {
    invoke('show_main_window');
  }

  async function on_exit(action) {
    await invoke("on_exit", { action });
  }

  async function register_shortcuts() {
    await register('ArrowLeft', () => {if(selection) selection--; interaction = true});
    await register('ArrowRight', () => {if(selection < 4) selection++; interaction = true});
    await register('Enter', () => on_exit(actions[selection]));
    await register('Escape', () => on_exit(""));
    await register('Q', () => on_exit(""));
  }
</script>

<main class="cont">
  <div class="w-full m-auto grid">

    <div class="flex flex-col mb-[6vh]">
      <div class="w-[9.6vw] aspect-square rounded-full mx-auto">
        <img src={user} alt="hibernate" class="p-[12%]" draggable="false" />
      </div>
      <div class="mt-[1vw] text-[#9399b2] mx-auto text-2xl font-normal">{name}</div>
    </div>

    <div class="grid grid-flow-col space-x-[2vw] m-auto ">
      {#each actions as action, i}
        <Card src={srcs[i]} action={action} selection={selection == i} />
      {/each}
    </div>

    <div class="text-[#9399b2] mx-auto text-xl font-normal my-[4vh]">
      {#if !interaction}
        System will hibernate in {counter} s
      {:else}
        Press&nbsp;&nbsp;{'\u23CE'}&nbsp;&nbsp;to confirm {actions[selection]}
      {/if}
    </div>

      <div class="button-container">
        <button class="button" on:click={() => on_exit(actions[selection])}>OK</button>
        <button class="button" on:click={() => on_exit("")}>Cancel</button>
      </div>

  </div>
</main>

<style>
.cont { @apply grid h-screen w-screen bg-[#1e1d2d] select-none cursor-default; }
.button { @apply w-48 m-auto bg-[#8bc2f0] text-[#1e1d2d] font-semibold; }
.button-container { @apply mx-auto my-4 space-x-2 grid grid-flow-col mt-[0vh]; }
</style>
