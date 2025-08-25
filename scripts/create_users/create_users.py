#!/usr/bin/env python3
import requests
import sys
import os
from urllib.parse import urljoin
import json
from pathlib import Path
from datetime import datetime
import logging
import re
import time
from typing import Tuple, Optional

# Importar credenciales
try:
    from llaves import SSL_ACCOUNT_KEY, SSL_SECRET_KEY
except ImportError:
    print("⚠️  No se encontró el archivo llaves.py con las credenciales")
    SSL_ACCOUNT_KEY = None
    SSL_SECRET_KEY = None

# Configuración
MAX_RETRIES = 3
RETRY_DELAY = 2  # segundos

# Configurar logging para guardar TODO en fuckeduplogs.logs
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s | %(message)s',
    handlers=[
        logging.FileHandler('fuckeduplogs.logs', mode='a', encoding='utf-8'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class SSLUserCreator:
    def __init__(self):
        self.host = "sws.sslpki.com"
        self.base_url = f"https://{self.host}"
        self.cert_path = Path(__file__).parent.parent / "SSL_COM_ROOT_CERTIFICATION_AUTHORITY_RSA.crt"
        
    def validate_password(self, password) -> Tuple[bool, str]:
        """Valida que la contraseña cumpla los requisitos de SSL.com
        Returns:
            Tuple[bool, str]: (es_valido, mensaje)
        """
        if not password:
            return False, "La contraseña no puede estar vacía"
            
        if len(password) < 8:
            return False, "La contraseña debe tener al menos 8 caracteres"
            
        checks = [
            (r'[A-Z]', "una mayúscula"),
            (r'[a-z]', "una minúscula"),
            (r'[0-9]', "un número"),
            (r'[~`!@#$%^&*()\-+=\[\]{}|;:\"<>,./?]', "un carácter especial")
        ]
        
        missing = []
        for pattern, desc in checks:
            if not re.search(pattern, password):
                missing.append(desc)
                
        if missing:
            return False, f"La contraseña debe incluir: {', '.join(missing)}"
            
        return True, "✅ Password válido"
        
    def validate_email(self, email: str) -> Tuple[bool, str]:
        """Valida formato básico de email
        Returns:
            Tuple[bool, str]: (es_valido, mensaje)
        """
        if not email:
            return False, "El email no puede estar vacío"
            
        if not "@" in email or not "." in email:
            return False, "Formato de email inválido"
            
        return True, "✅ Email válido"
        
    def validate_login(self, login: str) -> Tuple[bool, str]:
        """Valida el nombre de usuario
        Returns:
            Tuple[bool, str]: (es_valido, mensaje)
        """
        if not login:
            return False, "El usuario no puede estar vacío"
            
        if len(login) < 3:
            return False, "El usuario debe tener al menos 3 caracteres"
            
        if not re.match(r'^[a-zA-Z0-9_-]+$', login):
            return False, "El usuario solo puede contener letras, números, guiones y guiones bajos"
            
        return True, "✅ Usuario válido"

    def get_credentials(self) -> bool:
        """Solicita credenciales de forma interactiva
        Returns:
            bool: True si se obtuvieron todas las credenciales válidas
        """
        logger.info("\n=== SSL.com User Creation Tool ===\n")
        
        # Credenciales de API
        logger.info("🔑 API Credentials:")
        
        # Usar credenciales del archivo si existen
        self.account_key = SSL_ACCOUNT_KEY if SSL_ACCOUNT_KEY else input("Account Key: ").strip()
        self.secret_key = SSL_SECRET_KEY if SSL_SECRET_KEY else input("Secret Key: ").strip()
        
        if not all([self.account_key, self.secret_key]):
            logger.error("❌ Error: Las credenciales de API son requeridas")
            print("❌ Error: Las credenciales de API son requeridas")
            return False
            
        logger.info("✅ Credenciales de API cargadas")
        
        # Datos del nuevo usuario
        while True:
            try:
                logger.info("\n👤 Información del nuevo usuario:")
                
                # Usuario
                while True:
                    self.login = input("Login (min 3 chars, solo letras, números y guiones): ").strip()
                    is_valid, msg = self.validate_login(self.login)
                    if is_valid:
                        logger.info(f"✅ Usuario: {self.login}")
                        break
                    print(f"❌ {msg}")
                
                # Email
                while True:
                    self.email = input("Email: ").strip()
                    is_valid, msg = self.validate_email(self.email)
                    if is_valid:
                        logger.info(f"✅ Email: {self.email}")
                        break
                    print(f"❌ {msg}")
                
                # Password
                while True:
                    self.password = input("Password (min 8 chars, mayúscula, minúscula, número y carácter especial): ").strip()
                    is_valid, msg = self.validate_password(self.password)
                    if not is_valid:
                        print(f"❌ {msg}")
                        continue
                        
                    confirm_password = input("Confirm Password: ").strip()
                    if self.password != confirm_password:
                        print("❌ Las contraseñas no coinciden")
                        continue
                        
                    logger.info("✅ Password válido y confirmado")
                    break
                    
                return True
                
            except KeyboardInterrupt:
                print("\n\n⚠️ Operación cancelada por el usuario")
                return False
            except Exception as e:
                logger.error(f"❌ Error inesperado: {str(e)}")
                print(f"❌ Error inesperado: {str(e)}")
                return False

    def create_user(self) -> bool:
        """Realiza el request para crear el usuario
        Returns:
            bool: True si el usuario fue creado exitosamente
        """
        for attempt in range(MAX_RETRIES):
            try:
                if attempt > 0:
                    logger.info(f"\n🔄 Reintento {attempt + 1}/{MAX_RETRIES}...")
                    print(f"\n🔄 Reintento {attempt + 1}/{MAX_RETRIES}...")
                    time.sleep(RETRY_DELAY)
                else:
                    logger.info("\n🔄 Creando usuario...")
                    print("\n🔄 Creando usuario...")
                
                url = urljoin(self.base_url, "/users")
                
                # Preparar payload
                data = {
                    "login": self.login,
                    "email": self.email,
                    "password": self.password,
                    "account_key": self.account_key,
                    "secret_key": self.secret_key
                }

                # Mostrar request (ocultando datos sensibles en pantalla)
                safe_data = data.copy()
                safe_data["password"] = "********"
                safe_data["secret_key"] = "********"
                
                logger.info("\n📡 Request Details:")
                logger.info(f"URL: {url}")
                logger.info("Headers:")
                logger.info("  Accept: application/json")
                logger.info("  Content-Type: application/x-www-form-urlencoded")
                
                # Log completo para debug
                logger.debug("\nPayload (FULL DATA):")
                logger.debug(json.dumps(data, indent=2))
                
                # Versión segura para pantalla
                print("\n📡 Request Details:")
                print(f"URL: {url}")
                print("Headers: application/json")
                print("\nPayload (SAFE):")
                print(json.dumps(safe_data, indent=2))

                # Realizar request
                response = requests.post(
                    url,
                    data=data,
                    headers={
                        "Accept": "application/json",
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    verify=self.cert_path if self.cert_path.exists() else True,
                    timeout=10
                )
                
                # Guardar respuesta
                output_file = "create_users.json"
                with open(output_file, "w") as f:
                    if response.headers.get("content-type", "").startswith("application/json"):
                        json.dump(response.json(), f, indent=2)
                    else:
                        f.write(response.text)

                # Mostrar resultados
                logger.info(f"\n📊 Results:")
                logger.info(f"Status Code: {response.status_code}")
                logger.info(f"Response Time: {response.elapsed.total_seconds():.2f}s")
                logger.info(f"\n📝 Response saved to: {output_file}")
                
                if response.status_code == 200:
                    logger.info("\n✅ Usuario creado exitosamente!")
                    print("\n✅ Usuario creado exitosamente!")
                    return True
                    
                # Manejar errores conocidos
                try:
                    error_data = response.json()
                    if error_data.get("response_type") == "ERROR":
                        message = error_data.get("message", {})
                        if isinstance(message, dict):
                            for field, errors in message.items():
                                if isinstance(errors, list):
                                    error_msg = f"\n❌ Error en {field}: {', '.join(errors)}"
                                else:
                                    error_msg = f"\n❌ Error en {field}: {errors}"
                                logger.error(error_msg)
                                print(error_msg)
                                
                                # No reintentar si el usuario ya existe
                                if field == "login" and "already been taken" in str(errors):
                                    return False
                        else:
                            error_msg = f"\n❌ Error: {message}"
                            logger.error(error_msg)
                            print(error_msg)
                    else:
                        error_msg = f"\n❌ Error desconocido (status {response.status_code})"
                        logger.error(error_msg)
                        print(error_msg)
                except:
                    error_msg = f"\n❌ Error al procesar respuesta del servidor (status {response.status_code})"
                    logger.error(error_msg)
                    print(error_msg)
                    logger.error("\nResponse content:")
                    logger.error(response.text)

            except requests.exceptions.SSLError:
                error_msg = f"\n❌ SSL Error: Certificate verification failed\nExpected cert path: {self.cert_path}"
                logger.error(error_msg)
                print(error_msg)
                # No reintentar errores SSL
                return False
                
            except requests.exceptions.Timeout:
                error_msg = f"\n⚠️ Timeout en intento {attempt + 1}/{MAX_RETRIES}"
                logger.warning(error_msg)
                print(error_msg)
                # Continuar al siguiente intento
                continue
                
            except requests.exceptions.RequestException as e:
                error_msg = f"\n❌ Error de red: {str(e)}"
                logger.error(error_msg)
                print(error_msg)
                # Continuar al siguiente intento
                continue
                
            except Exception as e:
                error_msg = f"\n❌ Error inesperado: {str(e)}"
                logger.error(error_msg)
                print(error_msg)
                # No reintentar errores inesperados
                return False
                
        # Si llegamos aquí es que agotamos los reintentos
        logger.error(f"\n❌ Error: Se agotaron los {MAX_RETRIES} intentos")
        print(f"\n❌ Error: Se agotaron los {MAX_RETRIES} intentos")
        return False

def main():
    try:
        creator = SSLUserCreator()
        
        # Obtener credenciales
        if not creator.get_credentials():
            return
            
        # Loop principal
        while True:
            # Intentar crear usuario
            if creator.create_user():
                break
                
            # Si falló, preguntar si quiere reintentar
            print("\n¿Querés intentar de nuevo con un usuario diferente? (s/n)")
            retry = input().strip().lower()
            if retry != 's':
                break
                
            # Pedir nuevo usuario manteniendo las credenciales
            creator.account_key = SSL_ACCOUNT_KEY
            creator.secret_key = SSL_SECRET_KEY
            if not creator.get_credentials():
                break
                
    except KeyboardInterrupt:
        print("\n\n⚠️ Operación cancelada por el usuario")
    except Exception as e:
        logger.error(f"❌ Error fatal: {str(e)}")
        print(f"❌ Error fatal: {str(e)}")
    finally:
        print("\nPresiona Enter para salir...")
        input()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️ Operation cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Fatal Error: {str(e)}")
        sys.exit(1)
    finally:
        print("\nPress Enter to exit...")
        input()
