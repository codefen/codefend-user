@echo off
set APPLICATION_ID=%1
set APPLICATION_SECRET=%2
echo Solicitando token de acceso...
echo URL: https://api.esigner.com/v1/oauth/token
echo.

echo Probando conectividad...
ping -n 1 api.esigner.com >nul 2>&1

REM Verificar si el ping fue exitoso
if %errorlevel% neq 0 (
    echo ✗ ERROR: No se puede conectar a api.esigner.com
    echo ✗ El servidor no responde o no existe
    echo.
    echo Posibles causas:
    echo - El dominio api.esigner.com no existe
    echo - No tienes conexión a internet
    echo - Hay un firewall bloqueando la conexión
    echo.
    echo SCRIPT DETENIDO - No se puede continuar sin conectividad
    echo.
    pause
    exit /b 1
)

echo ✓ Conectividad OK - El servidor responde
echo.

echo Haciendo la petición...
curl -v -X POST https://api.esigner.com/v1/oauth/token ^
  -H "Content-Type: application/x-www-form-urlencoded" ^
  -d "grant_type=client_credentials&client_id=%APPLICATION_ID%&client_secret=%APPLICATION_SECRET%" ^
  -o get_token_2.json ^
  -w "HTTP Status: %%{http_code}\nTime: %%{time_total}s\n"

echo CONTENIDO DE LA RESPUESTA:
type get_token_2.json
echo.

echo.
echo Variables configuradas:
echo APPLICATION_ID: %APPLICATION_ID%
echo APPLICATION_SECRET: %APPLICATION_SECRET%
echo.

if exist get_token_2.json (
    echo ✓ Archivo response.json creado exitosamente
) else (
    echo ✗ Error: No se pudo crear el archivo get_token_2.json
)

echo.
pause