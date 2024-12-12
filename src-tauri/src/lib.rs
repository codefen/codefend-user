// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[cfg(target_os = "macos")]
#[macro_use]
extern crate cocoa;

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

use tauri::Emitter;
use tauri::{WebviewUrl, WebviewWindowBuilder};
use tauri_plugin_dialog;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_upload::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_process::init());

    #[cfg(target_os = "macos")]
    let builder = builder.plugin(tauri_traffic_light_positioner_plugin::init());

    builder
        .setup(|#[allow(unused_variables)] app| {
            #[cfg(desktop)]
            {
                #[cfg(desktop)]
                if cfg!(debug_assertions) {
                    app.handle().plugin(
                        tauri_plugin_log::Builder::default()
                            .level(log::LevelFilter::Info)
                            .build(),
                    )?;
                }
                let win_builder = WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
                    .title("")
                    .inner_size(800.0, 600.0)
                    .resizable(true)
                    .maximized(true);

                #[cfg(target_os = "macos")]
                let win_builder = win_builder
                    .decorations(true)
                    .title_bar_style(TitleBarStyle::Overlay);

                #[cfg(not(target_os = "macos"))]
                let win_builder = win_builder.decorations(false).transparent(true);

                win_builder.build().unwrap();

                app.handle().emit("window-ready", {}).unwrap();

                Ok(())
            }
        })
        .build(tauri::generate_context!())
        .expect("error while running tauri application");
}
