@echo off
setlocal enabledelayedexpansion

set ACCOUNT_KEY=%1
set SECRET_KEY=%2
set ENVIRONMENT=%3

if "%ACCOUNT_KEY%"=="" (
    echo Error: Falta ACCOUNT_KEY
    echo Uso: %0 "account_key" "secret_key" [test^|prod]
    echo.
    echo Este script obtiene las credenciales ACME para automatización SSL/TLS
    pause
    exit /b 1
)

if "%SECRET_KEY%"=="" (
    echo Error: Falta SECRET_KEY
    pause
    exit /b 1
)

REM Configurar URL según el entorno
if /i "%ENVIRONMENT%"=="prod" (
    set HOST=sws.sslpki.com
    set BASE_URL=https://sws.sslpki.com
    echo Obteniendo credenciales ACME de PRODUCCIÓN
) else (
    set HOST=sws-test.sslpki.com
    set BASE_URL=https://sws-test.sslpki.com
    echo Obteniendo credenciales ACME de SANDBOX
)

echo.
echo ==========================================
echo OBTENIENDO CREDENCIALES ACME
echo ==========================================
echo.
echo ¿Qué son las credenciales ACME?
echo - Permiten automatización completa de certificados SSL/TLS
echo - Renovación automática sin intervención manual
echo - Integración con Certbot, Kubernetes, Docker, etc.
echo.

echo Haciendo petición para obtener credenciales ACME...
echo URL: %BASE_URL%/api/acme/credentials (endpoint hipotético)
echo.

REM Nota: Este endpoint puede no existir, SSL.com puede requerir
REM obtener las credenciales ACME desde el dashboard web
echo ==========================================
echo MÉTODO ALTERNATIVO - VIA WEB DASHBOARD:
echo ==========================================
echo.
echo 1. Ve a tu cuenta SSL.com Dashboard
echo 2. Haz clic en "api credentials"
echo 3. Busca la sección "ACME Credentials" 
echo 4. Copia:
echo    - Account/ACME Key (para --eab-kid)
echo    - HMAC Key (para --eab-hmac-key)
echo.

REM Intentar obtener información de la cuenta que puede incluir ACME
curl -k ^
     -H "Accept: application/json" ^
     -H "Content-type: application/json" ^
     -X GET ^
     -d "{\"account_key\":\"%ACCOUNT_KEY%\",\"secret_key\":\"%SECRET_KEY%\"}" ^
     "%BASE_URL%/account" ^
     -o account_info.json ^
     -w "HTTP Status: %%{http_code}\nTime: %%{time_total}s\n"

echo.
echo ==========================================
echo INFORMACIÓN DE CUENTA:
echo ==========================================

if exist account_info.json (
    type account_info.json
    echo.
    
    REM Buscar información relacionada con ACME
    findstr "acme\|hmac\|eab" account_info.json >nul
    if %errorlevel% equ 0 (
        echo ✓ Información ACME encontrada en la respuesta:
        findstr "acme\|hmac\|eab" account_info.json
    ) else (
        echo ℹ  No se encontró información ACME en esta respuesta
        echo    Las credenciales ACME pueden estar disponibles solo en el dashboard web
    )
) else (
    echo ✗ Error: No se pudo obtener información de la cuenta
)

echo.
echo ==========================================
echo COMANDO CERTBOT EJEMPLO:
echo ==========================================
echo Una vez que tengas las credenciales ACME, puedes usar:
echo.
echo certbot certonly --manual \
echo   --server https://acme.ssl.com/sslcom-dv-ecc \
echo   --email tu@email.com \
echo   --eab-hmac-key TU_HMAC_KEY \
echo   --eab-kid TU_ACCOUNT_KEY \
echo   -d tudominio.com
echo.
echo ==========================================
echo VENTAJAS DE USAR ACME:
echo ==========================================
echo ✅ Automatización completa
echo ✅ Renovación automática
echo ✅ Integración con infraestructura
echo ✅ Validación automática de dominios
echo ✅ No más certificados vencidos
echo.

pause