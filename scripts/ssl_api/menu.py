#!/usr/bin/env python3
import os
import sys
import msvcrt
import time
import winsound
import random
from typing import List, Callable, Optional

from retro_sounds import RetroSounds

# Arte ASCII retro
BORDER_H = "═"
BORDER_V = "║"
BORDER_TL = "╔"
BORDER_TR = "╗"
BORDER_BL = "╚"
BORDER_BR = "╝"

CURSOR = "►"
LOADING_CHARS = "▀▄█▌▐"

class MenuItem:
    def __init__(self, title: str, action: Optional[Callable] = None, submenu: Optional[List['MenuItem']] = None):
        self.title = title
        self.action = action
        self.submenu = submenu

class Menu:
    def __init__(self, title: str, items: List[MenuItem]):
        self.title = title
        self.items = items
        self.selected = 0
        
    def _clear_screen(self):
        os.system('cls' if os.name == 'nt' else 'clear')
        
    def _loading_animation(self, text: str, duration: float = 1.0):
        """Muestra una animación retro de carga"""
        start = time.time()
        while time.time() - start < duration:
            for char in LOADING_CHARS:
                sys.stdout.write(f"\r{text} {char}")
                sys.stdout.flush()
                time.sleep(0.1)
        print()

    def _print_menu(self):
        self._clear_screen()
        width = 60
        
        # Borde superior
        print(f"\n {BORDER_TL}{BORDER_H * (width-2)}{BORDER_TR}")
        
        # Título centrado con bordes
        title = f"  {self.title}  "
        padding = (width - len(title)) // 2
        print(f"{BORDER_V}{' ' * padding}{title}{' ' * (width - padding - len(title) - 2)}{BORDER_V}")
        
        # Separador
        print(f"{BORDER_V}{BORDER_H * (width-2)}{BORDER_V}")
        print(f"{BORDER_V}{' ' * (width-2)}{BORDER_V}")
        
        # Items del menú
        for i, item in enumerate(self.items):
            prefix = CURSOR if i == self.selected else " "
            menu_text = f"  {prefix} [{i+1}] {item.title}"
            print(f"{BORDER_V}{menu_text}{' ' * (width - len(menu_text) - 2)}{BORDER_V}")
            
        print(f"{BORDER_V}{' ' * (width-2)}{BORDER_V}")
        
        # Ayuda
        help_text = "  ↑/↓: Navegar | Enter: Seleccionar | Esc: Volver/Salir"
        print(f"{BORDER_V}{help_text}{' ' * (width - len(help_text) - 2)}{BORDER_V}")
        
        # Borde inferior
        print(f"{BORDER_BL}{BORDER_H * (width-2)}{BORDER_BR}")
        
        # Easter egg: 1% de chance de un mensaje retro
        if random.random() < 0.01:
            print("\nINSERT COIN TO CONTINUE...")
        
    def _handle_input(self) -> bool:
        """Maneja input del usuario. Retorna True si debe salir del menú."""
        if not msvcrt.kbhit():
            time.sleep(0.1)
            return False
            
        key = msvcrt.getch()
        
        # Escape
        if key == b'\x1b':
            RetroSounds.play_error()
            return True
            
        # Enter
        if key == b'\r':
            RetroSounds.play_menu_select()
            item = self.items[self.selected]
            if item.action:
                self._clear_screen()
                self._loading_animation("LOADING", 1.0)
                item.action()
                RetroSounds.play_success()
                input("\nPresiona Enter para continuar...")
            elif item.submenu:
                submenu = Menu(item.title, item.submenu)
                submenu.display()
            return False
            
        # Flecha arriba
        if key == b'H':
            RetroSounds.play_menu_move()
            self.selected = (self.selected - 1) % len(self.items)
            
        # Flecha abajo
        if key == b'P':
            RetroSounds.play_menu_move()
            self.selected = (self.selected + 1) % len(self.items)
            
        # Cualquier otra tecla (para debug/diversión)
        else:
            RetroSounds.play_typing_sound()
            
        return False
        
    def display(self):
        """Muestra el menú y maneja la navegación"""
        while True:
            self._print_menu()
            if self._handle_input():
                break
