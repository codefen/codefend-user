#!/usr/bin/env python3
import requests
import sys

def test_revoked_credentials():
    """Prueba las credenciales antiguas para verificar revocación"""
    print("\n=== Verificando revocación de credenciales ===\n")
    
    old_credentials = {
        "account_key": "d47f660f18cd",
        "secret_key": "AJbPUYI1fO5rRA=="
    }
    
    url = "https://sws.sslpki.com/users"
    
    try:
        response = requests.post(
            url,
            data={
                "login": "test_revoked",
                "email": "test@example.com",
                "password": "Test123!@#",
                "account_key": old_credentials["account_key"],
                "secret_key": old_credentials["secret_key"]
            },
            headers={
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            }
        )
        
        print(f"Status Code: {response.status_code}")
        print("\nResponse:")
        print(response.text)
        
        if response.status_code in [401, 403]:
            print("\n✅ Confirmado: Las credenciales fueron revocadas correctamente")
        else:
            print("\n⚠️ ALERTA: Las credenciales antiguas aún podrían estar activas")
            
    except Exception as e:
        print(f"\n❌ Error al probar: {str(e)}")

if __name__ == "__main__":
    test_revoked_credentials()
