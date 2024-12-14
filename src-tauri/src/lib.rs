// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[cfg(target_os = "macos")]
extern crate cocoa;

#[cfg(target_os = "macos")]
extern crate objc;

use tauri::{Emitter, Manager, WebviewUrl, WebviewWindowBuilder};
use tauri_plugin_log::Target;
use tauri_plugin_log::TargetKind;

#[tauri::command]
fn create_main_window(app: tauri::AppHandle) -> Result<(), tauri::Error> {
    if app.get_webview_window("main").is_none() {
        let win_builder = WebviewWindowBuilder::new(&app, "main", WebviewUrl::default())
            .title("Codefend Panel")
            .inner_size(800.0, 600.0)
            .resizable(true)
            .maximized(true);

        #[cfg(not(target_os = "macos"))]
        let win_builder = win_builder.decorations(false).transparent(true);

        win_builder.build().unwrap();
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[cfg(debug_assertions)]
    let devtools = tauri_plugin_devtools::init();

    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_upload::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(devtools)
        .plugin(tauri_plugin_process::init());

    builder
        .setup(|#[allow(unused_variables)] app| {
            #[cfg(desktop)]
            {
                #[cfg(desktop)]
                if cfg!(debug_assertions) {
                    app.handle().plugin(
                        tauri_plugin_log::Builder::default()
                            .targets([
                                Target::new(TargetKind::LogDir { file_name: None }),
                                Target::new(TargetKind::Stdout),
                                Target::new(TargetKind::Webview),
                            ])
                            .level(log::LevelFilter::Info)
                            .build(),
                    )?;
                }
                create_main_window(app.handle().clone())?;

                app.handle().emit("window-ready", ()).unwrap();

                Ok(())
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
