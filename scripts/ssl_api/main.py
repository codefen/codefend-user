#!/usr/bin/env python3
import sys
import os
import time
import msvcrt
import winsound
from pathlib import Path
from menu import Menu, MenuItem
from create_users import SSLUserCreator

def create_user():
    """Wrapper para la creación de usuarios"""
    creator = SSLUserCreator()
    if creator.get_credentials():
        creator.create_user()

def view_api_map():
    """Muestra el mapa de la API"""
    with open('API_MAP.md', 'r', encoding='utf-8') as f:
        print(f.read())

from retro_sounds import RetroSounds

def show_intro():
    """Muestra una intro retro"""
    os.system('cls')
    intro_text = """
    ╔══════════════════════════════════════════════════════════╗
    ║                                                          ║
    ║                   SSL.com API MANAGER                    ║
    ║                                                          ║
    ║                    © 2025 CODEFEND                       ║
    ║                                                          ║
    ║          PRESS ANY KEY TO ACCESS THE MAINFRAME          ║
    ║                                                          ║
    ╚══════════════════════════════════════════════════════════╝
    """
    print(intro_text)
    
    # Efecto de "cargando"
    loading_text = "INITIALIZING SECURE CONNECTION"
    for i in range(3):
        print(f"\r{loading_text}{'.' * (i + 1)}   ", end='')
        RetroSounds.play_pattern('typing')
        time.sleep(0.5)
    print("\n\nACCESS GRANTED!")
    RetroSounds.play_powerup()
    time.sleep(1)

def reload_menu():
    """Recarga y redibuja el menú"""
    global main_menu_items  # Necesario para modificar la variable
    
    # Recrear items del menú
    main_menu_items = [
        MenuItem("Crear Usuario", create_user),
        MenuItem("Certificados SSL/TLS", submenu=[
            MenuItem("Basic SSL", lambda: print("🚧 En desarrollo...")),
            MenuItem("Premium SSL", lambda: print("🚧 En desarrollo...")),
            MenuItem("Enterprise EV", lambda: print("🚧 En desarrollo...")),
            MenuItem("Wildcard SSL/TLS", lambda: print("🚧 En desarrollo...")),
            MenuItem("Multi-domain (UCC/SAN)", lambda: print("🚧 En desarrollo...")),
        ]),
        MenuItem("Code Signing", submenu=[
            MenuItem("Standard Code Signing", lambda: print("🚧 En desarrollo...")),
            MenuItem("EV Code Signing", lambda: print("🚧 En desarrollo...")),
            MenuItem("Timestamp Service", lambda: print("🚧 En desarrollo...")),
        ]),
        MenuItem("Email & Client Auth", submenu=[
            MenuItem("S/MIME (Secure Email)", lambda: print("🚧 En desarrollo...")),
            MenuItem("Client Authentication", lambda: print("🚧 En desarrollo...")),
            MenuItem("Document Signing", lambda: print("🚧 En desarrollo...")),
        ]),
        MenuItem("Ver Mapa de API", view_api_map),
        MenuItem("Salir", lambda: sys.exit(0))
    ]
    
    # Limpiar pantalla y mostrar menú
    os.system('cls')
    menu = Menu("SSL.com Web Services (SWS) API", main_menu_items)
    menu.display()

def request_credentials():
    """Solicita y valida credenciales"""
    from auth import SSLAuth
    auth = SSLAuth()
    
    try:
        # Intentar cargar credenciales existentes
        creds = auth.load_credentials()
        if creds:
            account_key, secret_key = creds
            print("\n🔑 Probando credenciales guardadas...")
            valid, msg = auth.test_credentials(account_key, secret_key)
            if valid:
                print(msg)
                return True
            print(msg)
        
        # Solicitar nuevas credenciales
        while True:
            try:
                print("\n🔐 Ingrese sus credenciales de SSL.com:")
                account_key = input("Account Key: ").strip()
                secret_key = input("Secret Key: ").strip()
                
                if not account_key or not secret_key:
                    print("❌ Ambos campos son requeridos")
                    continue
                    
                print("\n🔄 Verificando credenciales...")
                valid, msg = auth.test_credentials(account_key, secret_key)
                print(msg)
                
                if valid:
                    # Guardar credenciales válidas
                    auth.save_credentials(account_key, secret_key)
                    return True
                
                while True:
                    retry = input("\n¿Reintentar? (s/n): ").strip().lower()
                    if retry in ['s', 'n']:
                        if retry == 'n':
                            return False
                        break
                    print("❌ Por favor ingrese 's' para sí o 'n' para no")
                    
            except KeyboardInterrupt:
                print("\n\n⚠️ Operación cancelada por el usuario")
                return False
                
    except Exception as e:
        print(f"\n❌ Error inesperado: {str(e)}")
        return False

def main():
    # Importar hot reload
    from hot_reload import start_hot_reload
    
    # Módulos a monitorear (paths relativos al directorio del script)
    script_dir = Path(__file__).parent
    modules = {
        'menu': str(script_dir / 'menu.py'),
        'retro_sounds': str(script_dir / 'retro_sounds.py'),
        'main': str(script_dir / 'main.py')
    }
    
    # Iniciar hot reload
    observer, reloader = start_hot_reload(modules, reload_menu)
    
    try:
        # Mostrar intro
        show_intro()
        msvcrt.getch()  # Esperar tecla
        
        # Validar credenciales
        if not request_credentials():
            print("\n❌ No se pudo acceder sin credenciales válidas")
            return
            
        RetroSounds.play_success()
        print("\n✨ Acceso concedido!")
        time.sleep(1)
        
        # Mostrar menú inicial
        reload_menu()
        
        # Mantener proceso vivo
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n\n⚠️ Cerrando aplicación...")
            time.sleep(0.5)
            return
            
    except Exception as e:
        print(f"\n❌ Error fatal: {str(e)}")
    finally:
        if 'observer' in locals():
            observer.stop()
            observer.join(timeout=1)  # Esperar máximo 1 segundo
        print("\n👋 ¡Hasta luego!")
        sys.exit(0)
    
    # Menú principal
    main_menu_items = [
        MenuItem("Crear Usuario", create_user),
        MenuItem("Certificados SSL/TLS", submenu=[
            MenuItem("Basic SSL", lambda: print("🚧 En desarrollo...")),
            MenuItem("Premium SSL", lambda: print("🚧 En desarrollo...")),
            MenuItem("Enterprise EV", lambda: print("🚧 En desarrollo...")),
            MenuItem("Wildcard SSL/TLS", lambda: print("🚧 En desarrollo...")),
            MenuItem("Multi-domain (UCC/SAN)", lambda: print("🚧 En desarrollo...")),
        ]),
        MenuItem("Code Signing", submenu=[
            MenuItem("Standard Code Signing", lambda: print("🚧 En desarrollo...")),
            MenuItem("EV Code Signing", lambda: print("🚧 En desarrollo...")),
            MenuItem("Timestamp Service", lambda: print("🚧 En desarrollo...")),
        ]),
        MenuItem("Email & Client Auth", submenu=[
            MenuItem("S/MIME (Secure Email)", lambda: print("🚧 En desarrollo...")),
            MenuItem("Client Authentication", lambda: print("🚧 En desarrollo...")),
            MenuItem("Document Signing", lambda: print("🚧 En desarrollo...")),
        ]),
        MenuItem("Ver Mapa de API", view_api_map),
        MenuItem("Salir", lambda: sys.exit(0))
    ]

    menu = Menu("SSL.com Web Services (SWS) API", main_menu_items)
    
    try:
        menu.display()
    except KeyboardInterrupt:
        print("\n\n⚠️ Operación cancelada por el usuario")
    except Exception as e:
        print(f"\n❌ Error fatal: {str(e)}")
    finally:
        print("\nGracias por usar SSL.com API")

if __name__ == "__main__":
    main()
