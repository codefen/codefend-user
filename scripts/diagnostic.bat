@echo off
echo ===============================================
echo DIAGNOSTICO DE CONECTIVIDAD SSL.COM
echo ===============================================
echo.

echo 1. Verificando conexion a internet general...
ping -n 2 8.8.8.8 >nul 2>&1
if %errorlevel% neq 0 (
    echo ✗ No hay conexion a internet
    goto :end
) else (
    echo ✓ conexion a internet OK
)
echo.

echo 2. Probando resolucion DNS...
nslookup sws.sslpki.com
echo.
nslookup sws-test.sslpki.com
echo.

echo 3. Ping detallado a produccion...
ping -n 3 sws.sslpki.com
echo.

echo 4. Ping detallado a testing...
ping -n 3 sws-test.sslpki.com
echo.

echo 5. Probando conectividad HTTP/HTTPS...
echo Probando HTTPS a produccion:
curl -I https://sws.sslpki.com --connect-timeout 10
echo.

echo Probando HTTPS a testing:
curl -I https://sws-test.sslpki.com --connect-timeout 10
echo.

echo 6. Verificando DNS alternativo...
echo Cambiando a DNS de Google (8.8.8.8)
nslookup sws.sslpki.com 8.8.8.8
echo.

echo 7. Traceroute a SSL.com...
tracert -h 10 sws.sslpki.com
echo.

:end
echo ===============================================
echo DIAGNOSTICO COMPLETO
echo ===============================================
pause