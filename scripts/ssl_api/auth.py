#!/usr/bin/env python3
import requests
from typing import Tuple, Optional
from pathlib import Path
import json

class SSLAuth:
    def __init__(self):
        self.host = "sws.sslpki.com"
        self.base_url = f"https://{self.host}"
        self.cert_path = Path(__file__).parent.parent / "SSL_COM_ROOT_CERTIFICATION_AUTHORITY_RSA.crt"
        
    def test_credentials(self, account_key: str, secret_key: str) -> Tuple[bool, str]:
        """Prueba las credenciales contra la API de SSL.com"""
        try:
            # Crear sesión para mantener cookies
            session = requests.Session()
            
            # Headers requeridos
            headers = {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "CodefendSSLManager/1.0"
            }
            
            # Primer paso: Iniciar sesión en la API
            login_response = session.post(
                f"{self.base_url}/api/login",
                headers=headers,
                data={
                    "account_key": account_key,
                    "secret_key": secret_key
                },
                verify=self.cert_path if self.cert_path.exists() else True,
                timeout=10,
                allow_redirects=True
            )
            
            if auth_response.status_code == 200:
                # Obtener token
                token_data = auth_response.json()
                access_token = token_data.get('access_token')
                
                if not access_token:
                    return False, "❌ Error: No se recibió token de acceso"
                    
                # Probar token con un endpoint real
                headers["Authorization"] = f"Bearer {access_token}"
                test_response = session.get(
                    f"{self.base_url}/api/v1/account",
                    headers=headers,
                    verify=self.cert_path if self.cert_path.exists() else True,
                    timeout=10
                )
                
                if test_response.status_code == 200:
                    return True, "✅ Credenciales válidas"
                else:
                    return False, f"❌ Error validando token: {test_response.status_code}"
                    
            elif auth_response.status_code == 401:
                return False, "❌ Credenciales inválidas"
            else:
                error_msg = f"❌ Error {auth_response.status_code}"
                try:
                    error_data = auth_response.json()
                    if 'error_description' in error_data:
                        error_msg += f": {error_data['error_description']}"
                    elif 'message' in error_data:
                        error_msg += f": {error_data['message']}"
                except:
                    if auth_response.text:
                        error_msg += f": {auth_response.text}"
                return False, error_msg
                
        except requests.exceptions.RequestException as e:
            return False, f"❌ Error de conexión: {str(e)}"
            
    def save_credentials(self, account_key: str, secret_key: str):
        """Guarda las credenciales en llaves.py"""
        content = f'''#!/usr/bin/env python3

# SSL.com API Credentials
SSL_ACCOUNT_KEY = "{account_key}"
SSL_SECRET_KEY = "{secret_key}"
'''
        with open(Path(__file__).parent / "llaves.py", "w") as f:
            f.write(content)
            
    def load_credentials(self) -> Optional[Tuple[str, str]]:
        """Intenta cargar credenciales desde llaves.py"""
        try:
            from . import llaves
            return llaves.SSL_ACCOUNT_KEY, llaves.SSL_SECRET_KEY
        except:
            return None
