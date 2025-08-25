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
            
            # Headers como en el BAT original
            headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
                "User-Agent": "CodefendSSLManager/1.0"
            }
            
            # URL del token endpoint
            url = f"{self.base_url}/oauth/token"
            
            # Datos como en el BAT original
            data = {
                "grant_type": "client_credentials",
                "client_id": account_key,
                "client_secret": secret_key
            }
            
            # Log del request
            print("\n📤 Request:")
            print(f"URL: {url}")
            print("Headers:", json.dumps(headers, indent=2))
            print("Data:", json.dumps(data, indent=2))
            
            login_response = session.post(
                url,
                headers=headers,
                data=data,
                verify=self.cert_path if self.cert_path.exists() else True,
                timeout=10,
                allow_redirects=True
            )
            
            # Log del response
            print("\n📥 Response:")
            print(f"Status: {login_response.status_code}")
            print("Headers:", json.dumps(dict(login_response.headers), indent=2))
            try:
                print("Body:", json.dumps(login_response.json(), indent=2))
            except:
                print("Body:", login_response.text)
            
            if login_response.status_code == 200:
                # Obtener token
                token_data = login_response.json()
                access_token = token_data.get('account_key')
                
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
                    
            elif login_response.status_code == 401:
                error_msg = "❌ Credenciales inválidas"
                if login_response.text:
                    error_msg += f"\nDetalles: {login_response.text}"
                return False, error_msg
            elif login_response.status_code == 302:
                # Si recibimos un redirect, intentamos seguirlo
                redirect_url = login_response.headers.get('Location')
                print(f"\n🔄 Redirigiendo a: {redirect_url}")
                
                redirect_response = session.get(
                    redirect_url,
                    headers=headers,
                    verify=self.cert_path if self.cert_path.exists() else True,
                    timeout=10
                )
                
                print("\n📥 Response después del redirect:")
                print(f"Status: {redirect_response.status_code}")
                print("Headers:", json.dumps(dict(redirect_response.headers), indent=2))
                try:
                    print("Body:", json.dumps(redirect_response.json(), indent=2))
                except:
                    print("Body:", redirect_response.text)
                    
                if redirect_response.status_code == 200:
                    return True, "✅ Credenciales válidas"
                else:
                    return False, f"❌ Error después del redirect: {redirect_response.status_code}"
            else:
                error_msg = f"❌ Error {login_response.status_code}"
                try:
                    error_data = login_response.json()
                    if 'error_description' in error_data:
                        error_msg += f"\nDescripción: {error_data['error_description']}"
                    elif 'message' in error_data:
                        error_msg += f"\nMensaje: {error_data['message']}"
                except:
                    if login_response.text:
                        error_msg += f"\nRespuesta: {login_response.text}"
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
