#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// IMPORTS
use std::process::Command;
use std::io;
use tauri::Builder;
use std::fs::{self};
use mac_address::get_mac_address;

// GLOBAL VARIABLES
const DEV_MODE: bool = true;
const PROD_URL: &str = "https://api.codefend.com/kundalini/";

#[tauri::command]
fn main() {
    Builder::default()
    .invoke_handler(
        tauri::generate_handler![scan_local, get_mac_addr],
    )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


// Windows command
#[cfg(target_os = "windows")]
#[tauri::command]
async fn scan_local(session_id: String) -> Result<String, String> {
    use std::process::Command;

    // Check for admin privileges
    if !admin_privileges() {
        return Err(r#"{"error": "Admin privileges required"}"#.to_string());
    }

    // PowerShell command
    let ps_command = format!(
        "Invoke-WebRequest -Uri \"https://web.codefend.com/releases/codefend-windows.exe\" -OutFile \"$env:TEMP\\codefend-windows.exe\"; Start-Process -FilePath \"cmd.exe\" -ArgumentList \"/c $env:TEMP\\codefend-windows.exe scan_local {} & pause\" -NoNewWindow; Remove-Item \"$env:TEMP\\codefend-windows.exe\"",
        session_id
    );

    // Execute the PowerShell command
    let output = Command::new("powershell")
        .arg("-Command")
        .arg(&ps_command)
        .output();

    match output {
        Ok(output) => {
            if output.status.success() {
                Ok(r#"{"success": "Scan completed successfully"}"#.to_string())
            } else {
                Err(String::from_utf8_lossy(&output.stderr).into_owned())
            }
        }
        Err(e) => Err(e.to_string()),
    }
}

// Linux scan
#[cfg(target_os = "linux")]
#[tauri::command]
async fn scan_local(session_id: String) -> Result<String, String> {
    use std::process::Command;

    // Check for admin privileges
    if !admin_privileges() {
        return Err(r#"{"error": "Admin privileges required"}"#.to_string());
    }

    // Linux command
    let linux_command = format!(
        "wget https://web.codefend.com/releases/codefend-linux -O /tmp/codefend-linux && chmod +x /tmp/codefend-linux && /tmp/codefend-linux scan_local {} ; rm /tmp/codefend-linux",
        session_id
    );

    // Execute the Linux command
    let output = Command::new("sh")
        .arg("-c")
        .arg(&linux_command)
        .output();

    match output {
        Ok(output) => {
            if output.status.success() {
                Ok(r#"{"success": "Scan completed successfully"}"#.to_string())
            } else {
                Err(String::from_utf8_lossy(&output.stderr).into_owned())
            }
        }
        Err(e) => Err(e.to_string()),
    }
}

// Mac scan
#[cfg(target_os = "macos")]
#[tauri::command]
async fn scan_local(session_id: String) -> Result<String, String> {
    if !admin_privileges() {
        return Err(r#"{"error": "Admin privileges required"}"#.to_string());
    }

    Ok(r#"{"success": "Scan completed successfully"}"#.to_string())
}

#[tauri::command]
async fn get_mac_addr() -> Result<String, String> {
    let mac_address_result = get_mac_address();
    let mac_address = match mac_address_result {
        Ok(Some(mac)) => mac.to_string(),
        Ok(None) => return Err("No MAC address found".to_string()),
        Err(e) => return Err(e.to_string()),
    };

    let json_response = json!({ "mac_address": mac_address }).to_string();
    Ok(json_response)
}

// Check admin privileges
fn admin_privileges() -> bool {
    is_elevated::is_elevated()
}
