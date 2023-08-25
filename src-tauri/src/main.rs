// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

#[tauri::command]
fn get_user() -> String {
    std::env!("USER").to_owned()
}

#[tauri::command]
fn on_exit(action: &str) {
    match action {
        "sleep" => {
            let _ = std::process::Command::new("systemctl")
                .arg("suspend")
                .output();
        },
        "hibernate" => {
            let _ = std::process::Command::new("systemctl")
                .arg("hibernate")
                .output();
        },
        "restart" => {
            let _ = std::process::Command::new("systemctl")
                .arg("reboot")
                .output();
        },
        "shutdown" => {
            let _ = std::process::Command::new("systemctl")
                .arg("poweroff")
                .output();
        },
        "logout" => {
            let _ = std::process::Command::new("bspc")
                .arg("quit")
                .output();
        },
        _ => ()
    }
    std::process::exit(0x0);
}


#[tauri::command]
async fn show_main_window(window: tauri::Window) {
    window.get_window("main").unwrap().show().unwrap();
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![on_exit, get_user, show_main_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
