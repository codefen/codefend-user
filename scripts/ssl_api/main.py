#!/usr/bin/env python3
import sys
import os
import time
import msvcrt
import winsound
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

def main():
    show_intro()
    msvcrt.getch()  # Esperar tecla
    
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
