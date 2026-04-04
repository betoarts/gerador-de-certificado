@echo off
echo ========================================
echo   CertificadoPro - Instalacao
echo ========================================
echo.

echo [1/3] Verificando Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Node.js nao encontrado!
    echo Instale em: https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js encontrado!
echo.

echo [2/3] Instalando dependencias do Backend...
cd /d "%~dp0backend"
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERRO ao instalar dependencias do backend!
    pause
    exit /b 1
)
echo Backend instalado!
echo.

echo [3/3] Instalando dependencias do Frontend...
cd /d "%~dp0frontend"
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERRO ao instalar dependencias do frontend!
    pause
    exit /b 1
)
echo Frontend instalado!
echo.

echo ========================================
echo   Instalacao concluida com sucesso!
echo   Execute start.bat para iniciar.
echo ========================================
pause
