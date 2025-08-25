#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, Tuple

import requests


BASE_HOST = "sws.sslpki.com"
BASE_URL = f"https://{BASE_HOST}"
CERT_PATH = Path(__file__).parent.parent / "SSL_COM_ROOT_CERTIFICATION_AUTHORITY_RSA.crt"

HEADERS_JSON = {
    "Accept": "application/json",
    "User-Agent": "CodefendSSLManager/1.0",
}


def _request(method: str, path: str, *, params: Dict[str, Any] | None = None, data: Dict[str, Any] | None = None) -> Tuple[int, Dict[str, Any] | str]:
    url = f"{BASE_URL}{path}"
    try:
        resp = requests.request(
            method,
            url,
            headers=HEADERS_JSON,
            params=params,
            data=data,
            verify=str(CERT_PATH) if CERT_PATH.exists() else True,
            timeout=15,
            allow_redirects=True,
        )
        try:
            return resp.status_code, resp.json()  # type: ignore[return-value]
        except Exception:
            return resp.status_code, resp.text
    except requests.RequestException as exc:
        return 0, f"connection_error: {exc}"


def retrieve_user_credentials(login: str, password: str) -> Tuple[int, Dict[str, Any] | str]:
    """GET /user/{login}/?password=..."""
    return _request("GET", f"/user/{login}/", params={"password": password})


def get_teams(login: str, password: str) -> Tuple[int, Dict[str, Any] | str]:
    """GET /users/get_teams?login=...&password=..."""
    return _request("GET", "/users/get_teams", params={"login": login, "password": password})


def set_default_team(login: str, password: str, acct_number: str) -> Tuple[int, Dict[str, Any] | str]:
    """PUT /users/set_default_team?login=...&password=...&acct_number=..."""
    return _request("PUT", "/users/set_default_team", params={"login": login, "password": password, "acct_number": acct_number})


