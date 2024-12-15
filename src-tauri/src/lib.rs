// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[cfg(target_os = "macos")]
extern crate cocoa;

#[cfg(target_os = "macos")]
extern crate objc;

use tauri::{
    Emitter, LogicalSize, Manager, PhysicalPosition, Position, WebviewUrl, WebviewWindowBuilder,
};
use tauri_plugin_log::Target;
use tauri_plugin_log::TargetKind;
use tauri_plugin_window_state::StateFlags;

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
        .plugin(tauri_plugin_http::init())
        .plugin(
            tauri_plugin_window_state::Builder::default()
                .with_state_flags(StateFlags::all())
                .build(),
        )
        .plugin(tauri_plugin_store::Builder::default().build())
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
