@echo off
setlocal enabledelayedexpansion

set USERNAME=%1
set PASSWORD=%2
set ENVIRONMENT=%3

if "%USERNAME%"=="" (
    echo Error: Falta USERNAME
    echo Uso: %0 "username" "password" [test^|prod]
    echo.
    echo Nota: Este script requiere SSL_COM_RSA_SSL_SUBCA.crt en la misma carpeta
    pause
    exit /b 1
)

if "%PASSWORD%"=="" (
    echo Error: Falta PASSWORD
    pause
    exit /b 1
)

if not exist "SSL_COM_RSA_SSL_SUBCA.crt" (
    echo ==========================================
    echo ERROR: CERTIFICADO SSL.COM NO ENCONTRADO
    echo ==========================================
    echo.
    echo El archivo SSL_COM_RSA_SSL_SUBCA.crt no existe en esta carpeta.
    echo.
    echo Para obtenerlo:
    echo 1. Ve a: https://www.ssl.com/download/ssl-com-root-and-intermediate-certificates/
    echo 2. Descarga: "SSL.com Intermediate and Root Certificates"
    echo 3. Extrae SSL_COM_RSA_SSL_SUBCA.crt a esta carpeta
    echo.
    echo Alternativamente, descargandolo directamente...
    echo.
    
    echo Descargando certificado SSL.com...
    curl -L "https://www.ssl.com/repository/SSL_COM_RSA_SSL_SUBCA.crt" ^
         -o "SSL_COM_RSA_SSL_SUBCA.crt"
    
    if exist "SSL_COM_RSA_SSL_SUBCA.crt" (
        echo Certificado descargado exitosamente
    ) else (
        echo Error descargando certificado
        echo   Descargalo manualmente y colocalo en esta carpeta
        pause
        exit /b 1
    )
)

if /i "%ENVIRONMENT%"=="prod" (
    set HOST=sws.sslpki.com
    set BASE_URL=https://sws.sslpki.com
    echo Usando entorno de PRODUCCION
) else (
    set HOST=sws-test.sslpki.com
    set BASE_URL=https://sws-test.sslpki.com
    echo Usando entorno de TESTING/SANDBOX
)

echo.
echo Configuracion:
echo Host: %HOST%
echo Username: %USERNAME%
echo Password: [OCULTO]
echo Certificado CA: SSL_COM_RSA_SSL_SUBCA.crt
echo.

echo Verificando certificado SSL.com...
if exist "SSL_COM_RSA_SSL_SUBCA.crt" (
    certutil -dump "SSL_COM_RSA_SSL_SUBCA.crt" | findstr "Subject:" > cert_info.txt
    if exist cert_info.txt (
        echo Certificado SSL.com valido:
        type cert_info.txt
        del cert_info.txt
    )
) else (
    echo Certificado no encontrado
    pause
    exit /b 1
)

echo.
echo Obteniendo credenciales API desde SSL.com...
echo URL: %BASE_URL%/user/%USERNAME%
echo ==========================================

curl -L ^
     --cacert "SSL_COM_ROOT_CERTIFICATION_AUTHORITY_RSA.crt" ^
     --request GET ^
     --data-urlencode "password=%PASSWORD%" ^
     "%BASE_URL%/user/%USERNAME%"