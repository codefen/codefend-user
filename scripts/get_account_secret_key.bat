@echo off
set USERNAME=%1
set PASSWORD=%2
set HOST=sws.sslpki.com
set URL=https://%HOST%/user/%USERNAME%
echo Solicitando token de acceso...
echo URL: %URL%
echo.

echo Variables configuradas:
echo USERNAME: %USERNAME%
echo PASSWORD: %PASSWORD%
echo.

echo Haciendo la peticion...
curl -L --request GET ^
  --data-urlencode "password=%PASSWORD%" ^
  "%URL%" ^
  -o get_account_secret_key.json ^
  -w "HTTP Status: %%{http_code}\nTime: %%{time_total}s\n"
echo.

if %errorlevel% neq 0 (
    echo X ERROR: La peticion curl fallo
    echo.
    pause
    exit /b 1
)

echo CONTENIDO DE LA RESPUESTA:
if exist get_account_secret_key.json (
    type get_account_secret_key.json
    echo.
    echo * Archivo get_account_secret_key.json creado exitosamente
) else (
    echo X Error: No se pudo crear el archivo get_account_secret_key.json
)

echo.
pause