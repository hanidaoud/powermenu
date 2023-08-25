import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { register } from '@tauri-apps/api/globalShortcut';

// Images
import user from "./assets/user.svg";
import hibernate from "./assets/hibernate.svg";
import sleep from "./assets/sleep.svg";
import restart from "./assets/restart.svg";
import shutdown from "./assets/shutdown.svg";
import logout from "./assets/logout.svg";

// Consts
const timeout = 30;

function App() {
  // State vars
  const [name, setName] = useState(" ");
  const [counter, setCounter] = useState(timeout);

  // Rust functions
  async function get_user() {
    setName(await invoke("get_user"));
  }
  async function show_main_window() {
    invoke('show_main_window');
  }

  async function register_shortcuts() {
    await register('Escape', () => {
      on_exit("");
    });
  }

  // useEffect
  useEffect(() => {
    get_user();
    show_main_window();
    register_shortcuts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (counter !== 0) setCounter(counter - 1);
    }, 1000);
    if (counter === 0) on_exit("hibernate");
    return () => clearInterval(interval);
  }, [counter]);

  return (
    <div className="grid h-screen w-screen bg-[#1e1d2d] select-none cursor-default">
      <div className="w-full m-auto grid">

        <div className="flex flex-col mb-[6vh]">
          <div className="w-[9.6vw] aspect-square rounded-full mx-auto">
            <img src={user} alt="hibernate" className="p-[12%]" draggable="false" />
          </div>
          <div className="mt-[1vw] text-[#9399b2] mx-auto text-2xl font-normal">{name}</div>
        </div>

        <div className="grid grid-flow-col space-x-[2vw] m-auto ">
          <Card src={sleep} action="sleep" />
          <Card src={hibernate} action="hibernate" />
          <Card src={restart} action="restart" />
          <Card src={shutdown} action="shutdown" />
          <Card src={logout} action="logout" />
        </div>

        <div className="text-[#9399b2] mx-auto text-xl font-normal my-[4vh]">System will hibernate in {counter} s</div>

        <div className="mx-auto my-4 space-x-2 grid grid-flow-col mt-[0vh]">
          <button className="w-48 m-auto bg-[#8bc2f0] text-[#1e1d2d] font-semibold" onClick={() => on_exit("hibernate")}>OK</button>
          <button className="w-48 m-auto bg-[#8bc2f0] text-[#1e1d2d] font-semibold" onClick={() => on_exit("")}>Cancel</button>
        </div>

      </div>
    </div>
  );
}

export default App;

const Card = (props) => {
  return (
      <div className="flex flex-col ">
        <div className="w-[9.6vw] aspect-square rounded-full hover:bg-[#313244] hover:cursor-pointer mx-auto"
            onClick={() => {on_exit(props.action)}}>
          <img src={props.src} alt={props.action} className="p-[12%]" draggable="false" />
        </div>
        <div className="mt-[1vw] text-[#9399b2] mx-auto text-2xl font-normal">
          {props.action.charAt(0).toUpperCase() + props.action.slice(1)}
        </div>
      </div>
  );
}


async function on_exit(action) {
  await invoke("on_exit", { action });
}
