// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[cfg(target_os = "macos")]
extern crate cocoa;

#[cfg(target_os = "macos")]
extern crate objc;

use tauri::{
    Emitter, LogicalSize, Manager, PhysicalPosition, Position, WebviewUrl, WebviewWindowBuilder,
};
use tauri_plugin_window_state::StateFlags;
use tauri_plugin_devtools::init as devtools_init;

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

        let window = win_builder.build().unwrap();
        window.set_min_size(Some(LogicalSize::new(800.0, 600.0)))?;
        if let Ok(Some(monitor)) = window.current_monitor() {
            let monitor_size = monitor.size();
            let window_size = window.outer_size()?;

            let center_x = (monitor_size.width as f64 - window_size.width as f64) / 2.0;
            let center_y = (monitor_size.height as f64 - window_size.height as f64) / 2.0;

            window.set_position(Position::Physical(PhysicalPosition::new(
                center_x as i32,
                center_y as i32,
            )))?;
        }
    }
    Ok(())
}

#[tauri::command]
fn open_devtools_for_main(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(win) = app.get_webview_window("main") {
        win.open_devtools();
        Ok(())
    } else {
        Err("main window not found".into())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let  builder = tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_upload::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(devtools_init())
        .plugin(
            tauri_plugin_window_state::Builder::default()
                .with_state_flags(StateFlags::all())
                .build(),
        )
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_process::init());

    builder
        .invoke_handler(tauri::generate_handler![open_devtools_for_main])
        .setup(|#[allow(unused_variables)] app| {
            #[cfg(desktop)]
            {
                create_main_window(app.handle().clone())?;

                app.handle().emit("window-ready", ()).unwrap();
                Ok(())
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
