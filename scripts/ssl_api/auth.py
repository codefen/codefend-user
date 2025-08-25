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

            # Headers mínimos para la API SWS
            headers = {
                "Accept": "application/json",
                "User-Agent": "CodefendSSLManager/1.0"
            }

            # Validación al estilo BAT: POST /users con datos dummy + credenciales.
            # Si autentica, el servidor responde 200/400 (errores de validación del usuario),
            # y eso nos sirve para confirmar credenciales.
            users_url = f"{self.base_url}/users"
            post_headers = {
                **headers,
                "Content-Type": "application/x-www-form-urlencoded",
            }
            dummy_payload = {
                "login": "auth_check_user",
                "email": "not-an-email",  # fuerza 400 de validación sin crear usuario
                "password": "Dummy123!xA",
                "account_key": account_key,
                "secret_key": secret_key,
            }

            print("\n📤 Request:")
            print(f"URL: {users_url}")
            print("Headers:", json.dumps(post_headers, indent=2))
            print("Data:", json.dumps({**dummy_payload, "secret_key": secret_key}, indent=2))

            response = session.post(
                users_url,
                headers=post_headers,
                data=dummy_payload,
                verify=self.cert_path if self.cert_path.exists() else True,
                timeout=10,
                allow_redirects=True,
            )

            print("\n📥 Response:")
            print(f"Status: {response.status_code}")
            print("Headers:", json.dumps(dict(response.headers), indent=2))
            try:
                print("Body:", json.dumps(response.json(), indent=2))
            except Exception:
                print("Body:", response.text)

            if response.status_code in (200, 400):
                return True, "✅ Credenciales válidas"
            if response.status_code in (401, 403):
                return False, "❌ Credenciales inválidas"

            # Reintento único contra /api/v1/account si el cluster devuelve 500 aquí
            if response.status_code == 500:
                from urllib.parse import urlencode
                account_url = f"{self.base_url}/api/v1/account"
                params = {"account_key": account_key, "secret_key": secret_key}
                print("\n⚠️ /users devolvió 500. Probando /api/v1/account...")
                print(f"URL: {account_url}?{urlencode(params)}")
                acc_resp = session.get(
                    account_url,
                    headers=headers,
                    params=params,
                    verify=self.cert_path if self.cert_path.exists() else True,
                    timeout=10,
                    allow_redirects=True,
                )
                print("\n📥 /api/v1/account Response:")
                print(f"Status: {acc_resp.status_code}")
                try:
                    print("Body:", json.dumps(acc_resp.json(), indent=2))
                except Exception:
                    print("Body:", acc_resp.text)
                if acc_resp.status_code == 200:
                    return True, "✅ Credenciales válidas"
                if acc_resp.status_code in (401, 403):
                    return False, "❌ Credenciales inválidas"

            error_msg = f"❌ Error {response.status_code}"
            if response.text:
                error_msg += f"\nRespuesta: {response.text}"
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
