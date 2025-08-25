#!/usr/bin/env python3
import winsound
import random
import time
from typing import List, Tuple

class RetroSounds:
    # Notas musicales (frecuencias en Hz)
    NOTES = {
        'C4': 262,  # Do
        'D4': 294,  # Re
        'E4': 330,  # Mi
        'F4': 349,  # Fa
        'G4': 392,  # Sol
        'A4': 440,  # La
        'B4': 494,  # Si
        'C5': 523,  # Do alto
    }
    
    # Patrones melódicos (nota, duración en ms)
    PATTERNS = {
        'coin': [
            ('B4', 50),
            ('E4', 130)
        ],
        'powerup': [
            ('G4', 50),
            ('B4', 50),
            ('D4', 50),
            ('G4', 150)
        ],
        'typing': [
            # Patrón 1: Escala ascendente rápida
            [('C4', 30), ('E4', 30), ('G4', 30)],
            # Patrón 2: Arpegio descendente
            [('C5', 30), ('G4', 30), ('E4', 30)],
            # Patrón 3: Ping pong
            [('E4', 30), ('B4', 30), ('E4', 30)],
            # Patrón 4: Saltos
            [('C4', 30), ('G4', 30), ('C5', 30)],
        ],
        'error': [
            ('E4', 100),
            ('C4', 200)
        ],
        'success': [
            ('C4', 50),
            ('E4', 50),
            ('G4', 50),
            ('C5', 150)
        ],
        'menu_move': [
            ('A4', 20),
            ('B4', 20)
        ],
        'menu_select': [
            ('C5', 40),
            ('G4', 80)
        ]
    }
    
    @classmethod
    def play_pattern(cls, pattern_name: str):
        """Reproduce un patrón predefinido"""
        if pattern_name not in cls.PATTERNS:
            return
            
        pattern = cls.PATTERNS[pattern_name]
        if isinstance(pattern[0], list):  # Si es una lista de patrones, elegir uno al azar
            pattern = random.choice(pattern)
            
        for note, duration in pattern:
            winsound.Beep(cls.NOTES[note], duration)
            
    @classmethod
    def play_typing_sound(cls):
        """Sonido aleatorio para typing con probabilidad variable"""
        if random.random() < 0.3:  # 30% de chance de sonido
            cls.play_pattern('typing')
        
    @classmethod
    def play_mario_coin(cls):
        """El clásico sonido de moneda"""
        cls.play_pattern('coin')
        
    @classmethod
    def play_powerup(cls):
        """Sonido tipo power-up"""
        cls.play_pattern('powerup')
        
    @classmethod
    def play_error(cls):
        """Sonido de error"""
        cls.play_pattern('error')
        
    @classmethod
    def play_success(cls):
        """Melodía de éxito"""
        cls.play_pattern('success')
        
    @classmethod
    def play_menu_move(cls):
        """Sonido al mover en menú"""
        cls.play_pattern('menu_move')
        
    @classmethod
    def play_menu_select(cls):
        """Sonido al seleccionar en menú"""
        cls.play_pattern('menu_select')
