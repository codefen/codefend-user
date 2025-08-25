@echo off
set ACCOUNT_KEY=%1
set SECRET_KEY=%2
set PER_PAGE=%3
set PAGE=%4
set ENVIRONMENT=%5

if "%ACCOUNT_KEY%"=="" (
    echo Error: Falta ACCOUNT_KEY
    echo Uso: %0 "account_key" "secret_key" [per_page] [page] [test^|prod]
    echo.
    echo Ejemplos:
    echo   %0 "tu_account_key" "tu_secret_key"
    echo   %0 "tu_account_key" "tu_secret_key" 20 1 test
    echo   %0 "tu_account_key" "tu_secret_key" 5 2 prod
    pause
    exit /b 1
)

if "%SECRET_KEY%"=="" (
    echo Error: Falta SECRET_KEY
    echo Uso: %0 "account_key" "secret_key" [per_page] [page] [test^|prod]
    pause
    exit /b 1
)

if "%PER_PAGE%"=="" set PER_PAGE=10
if "%PAGE%"=="" set PAGE=1

if /i "%ENVIRONMENT%"=="test" (
    set HOST=sws-test.sslpki.com
    set BASE_URL=https://sws-test.sslpki.com
    echo Usando entorno de TESTING/SANDBOX
    echo ✓ Modo seguro - certificados de prueba
) else (
    set HOST=sws.sslpki.com
    set BASE_URL=https://sws.sslpki.com
    echo Usando entorno de PRODUCCIÓN
    echo ⚠  Listando certificados reales
)

echo.
echo Configuracion:
echo Host: %HOST%
echo Certificados por pagina: %PER_PAGE%
echo Pagina: %PAGE%
echo.


echo Obteniendo lista de certificados SSL.com...
echo URL: %BASE_URL%/certificates
echo ==========================================

echo {^
  "account_key": "%ACCOUNT_KEY%",^
  "secret_key": "%SECRET_KEY%",^
  "per_page": "%PER_PAGE%",^
  "page": "%PAGE%"^
} > list_certificates_payload.json

echo Payload JSON:
type list_certificates_payload.json
echo.

curl -k ^
     -H "Accept: application/json" ^
     -H "Content-type: application/json" ^
     -X GET ^
     -d "@list_certificates_payload.json" ^
     "%BASE_URL%/certificates" ^
     -o list_certificates.json ^
     -w "HTTP Status: %%{http_code}\nTime: %%{time_total}s\n"

echo.
echo ==========================================

if %errorlevel% neq 0 (
    echo ✗ ERROR: La petición fallo
    echo.
    pause
    exit /b 1
)

echo LISTA DE CERTIFICADOS:
if exist list_certificates.json (
    echo.
    type list_certificates.json
    echo.
    echo ✓ Lista guardada en list_certificates.json
    
    findstr "ref\|product\|order_status\|common_name\|error" list_certificates.json >nul
    if %errorlevel% equ 0 (
        echo.
        echo ==========================================
        echo INFORMACIÓN DE CERTIFICADOS ENCONTRADA:
        echo ==========================================
        
        REM Mostrar información relevante de certificados
        echo Buscando referencias de certificados (ref):
        findstr "ref" list_certificates.json
        echo.
        echo Buscando nombres comunes (common_name):
        findstr "common_name" list_certificates.json
        echo.
        echo Buscando estados de órdenes (order_status):
        findstr "order_status" list_certificates.json
        echo.
        echo Buscando productos:
        findstr "product" list_certificates.json
        echo.
        echo Buscando errores:
        findstr "error" list_certificates.json
        echo.
    )
    
    REM Verificar el tamaño del archivo
    for %%A in (list_certificates.json) do set filesize=%%~zA
    if %filesize% GTR 50 (
        echo ℹ  Respuesta recibida con %filesize% bytes
        echo ℹ  Parece que hay datos de certificados
    ) else (
        echo ⚠ Respuesta pequeña (%filesize% bytes), puede que no haya certificados o haya un error
    )
    
) else (
    echo ✗ Error: No se pudo crear el archivo de respuesta
    echo ✗ Verifica tus credenciales
)

echo.
echo ==========================================
echo PARÁMETROS UTILIZADOS:
echo ==========================================
echo ACCOUNT_KEY: %ACCOUNT_KEY%
echo SECRET_KEY: [OCULTO - Primeros 4 chars: %SECRET_KEY:~0,4%...]
echo PER_PAGE: %PER_PAGE%
echo PAGE: %PAGE%
echo HOST: %HOST%
echo.

REM Mostrar opciones adicionales
echo ==========================================
echo OPCIONES ADICIONALES:
echo ==========================================
echo Para ver más certificados: %0 "%ACCOUNT_KEY%" "%SECRET_KEY%" %PER_PAGE% 2
echo Para más certificados por página: %0 "%ACCOUNT_KEY%" "%SECRET_KEY%" 20 1
echo.

REM Limpiar archivo temporal
if exist list_certificates_payload.json del list_certificates_payload.json

pause