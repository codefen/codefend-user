#!/usr/bin/env python3
import os
import time
import importlib
from typing import Dict, Callable
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class HotReloader(FileSystemEventHandler):
    def __init__(self, module_paths: Dict[str, str], reload_callback: Callable):
        """
        module_paths: Dict[module_name, file_path]
        reload_callback: Función a llamar después de recargar módulos
        """
        self.module_paths = module_paths
        self.modules = {}
        self.reload_callback = reload_callback
        self.last_reload = {}
        
        # Cargar módulos inicialmente
        for name, path in module_paths.items():
            self.last_reload[path] = 0
            spec = importlib.util.spec_from_file_location(name, path)
            if spec and spec.loader:
                module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(module)
                self.modules[name] = module
    
    def on_modified(self, event):
        if event.is_directory:
            return
            
        path = Path(event.src_path).resolve()
        str_path = str(path)
        
        # Evitar recargas múltiples por el mismo evento
        now = time.time()
        if str_path in self.last_reload and now - self.last_reload[str_path] < 1:
            return
            
        # Buscar qué módulo cambió
        for name, module_path in self.module_paths.items():
            if str(Path(module_path).resolve()) == str_path:
                try:
                    # Recargar módulo
                    spec = importlib.util.spec_from_file_location(name, module_path)
                    if spec and spec.loader:
                        module = importlib.util.module_from_spec(spec)
                        spec.loader.exec_module(module)
                        self.modules[name] = module
                        self.last_reload[str_path] = now
                        
                        # Llamar callback de recarga
                        self.reload_callback()
                        print(f"\n🔄 Recargado: {name}")
                except Exception as e:
                    print(f"\n❌ Error al recargar {name}: {str(e)}")
                break

def start_hot_reload(module_paths: Dict[str, str], reload_callback: Callable):
    """Inicia el hot reload para los módulos especificados"""
    # Crear observer
    observer = Observer()
    reloader = HotReloader(module_paths, reload_callback)
    
    # Monitorear directorio de cada módulo
    watched_dirs = set()
    for path in module_paths.values():
        dir_path = str(Path(path).parent)
        if dir_path not in watched_dirs:
            observer.schedule(reloader, dir_path, recursive=False)
            watched_dirs.add(dir_path)
    
    # Iniciar observer en background
    observer.start()
    return observer, reloader
