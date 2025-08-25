@echo off
setlocal enabledelayedexpansion

REM SSL API User Info Script
REM Usage: get_user_info.bat USERNAME PASSWORD

if "%~1"=="" (
    echo Error: USERNAME parameter is required
    echo Usage: %0 USERNAME PASSWORD
    exit /b 1
)

if "%~2"=="" (
    echo Error: PASSWORD parameter is required
    echo Usage: %0 USERNAME PASSWORD
    exit /b 1
)

set USERNAME=%~1
set PASSWORD=%~2
set CERT_PATH=..\SSL_COM_ROOT_CERTIFICATION_AUTHORITY_RSA.crt

REM Check if certificate exists
if not exist "%CERT_PATH%" (
    echo Error: Certificate file not found at %CERT_PATH%
    exit /b 1
)

echo Making SSL API request for user: %USERNAME%
echo.

curl -L ^
     --cacert "%CERT_PATH%" ^
     --request GET ^
     --data-urlencode "password=%PASSWORD%" ^
     "https://sws-test.sslpki.com/user/%USERNAME%"

echo.
echo Request completed.