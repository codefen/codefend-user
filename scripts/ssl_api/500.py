#!/usr/bin/env python3
import sys
import json
from pathlib import Path
from urllib.parse import urlencode

import requests


def main():
    if len(sys.argv) < 3:
        print("Uso: python 500.py <ACCOUNT_KEY> <SECRET_KEY>")
        sys.exit(1)

    account_key = sys.argv[1]
    secret_key = sys.argv[2]

    host = "sws.sslpki.com"
    base_url = f"https://{host}"
    cert_path = Path(__file__).parent.parent / "SSL_COM_ROOT_CERTIFICATION_AUTHORITY_RSA.crt"

    headers = {
        "Accept": "application/json",
        "User-Agent": "CodefendSSLManager/1.0",
    }

    url = f"{base_url}/api/v1/account"
    params = {"account_key": account_key, "secret_key": secret_key}

    # Log del request (exactamente como envía la app)
    print("\n📤 Request:")
    print(f"URL: {url}?{urlencode(params)}")
    print("Headers:", json.dumps(headers, indent=2))

    try:
        resp = requests.get(
            url,
            headers=headers,
            params=params,
            verify=str(cert_path) if cert_path.exists() else True,
            timeout=10,
            allow_redirects=True,
        )
    except requests.RequestException as e:
        print(f"❌ Error de conexión: {e}")
        sys.exit(2)

    print("\n📥 Response:")
    print(f"Status: {resp.status_code}")
    print("Headers:", json.dumps(dict(resp.headers), indent=2))
    try:
        print("Body:", json.dumps(resp.json(), indent=2))
    except Exception:
        print("Body:", resp.text)


if __name__ == "__main__":
    main()


