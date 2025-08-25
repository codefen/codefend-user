@echo off
setlocal enabledelayedexpansion

set ACCOUNT_KEY=%1
set SECRET_KEY=%2
set NEW_LOGIN=%3
set NEW_EMAIL=%4
set NEW_PASSWORD=%5
set HOST=sws.sslpki.com
set BASE_URL=https://%HOST%

echo Solicitando token de acceso...
echo URL: %BASE_URL%
echo.

echo Parámetros:
echo Login: %NEW_LOGIN%
echo Email: %NEW_EMAIL%
echo Password: [OCULTO]
echo Account Key: %ACCOUNT_KEY%
echo Secret Key: [OCULTO]
echo.

echo Haciendo la petición con URL encoding automático...
echo.
set CERT_PATH=..\SSL_COM_ROOT_CERTIFICATION_AUTHORITY_RSA.crt

curl -X POST "%BASE_URL%/users" ^
     --cacert "%CERT_PATH%" ^
     -H "Accept: application/json" ^
     -H "Content-Type: application/x-www-form-urlencoded" ^
     --data-urlencode "login=%NEW_LOGIN%" ^
     --data-urlencode "email=%NEW_EMAIL%" ^
     --data-urlencode "password=%NEW_PASSWORD%" ^
     --data-urlencode "account_key=%ACCOUNT_KEY%" ^
     --data-urlencode "secret_key=%SECRET_KEY%" ^
     -o create_users.json ^
     -w "HTTP Status: %%{http_code}\nTime: %%{time_total}s\n"

echo.

if %errorlevel% neq 0 (
    echo ✗ ERROR: La peticion fallo
    echo.
    pause
    exit /b 1
)

echo CONTENIDO DE LA RESPUESTA:
if exist create_users.json (
    type create_users.json
    echo.
    echo * Archivo create_users.json creado exitosamente
) else (
    echo X Error: No se pudo crear el archivo create_users.json
)

echo.
pause