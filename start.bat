@echo off
echo ========================================
echo   CertificadoPro - Iniciando...
echo ========================================
echo.

echo Verificando dependencias...
if not exist "%~dp0backend\node_modules" (
    echo ERRO: Dependencias do backend nao encontradas!
    echo Execute install.bat primeiro.
    pause
    exit /b 1
)
if not exist "%~dp0frontend\node_modules" (
    echo ERRO: Dependencias do frontend nao encontradas!
    echo Execute install.bat primeiro.
    pause
    exit /b 1
)

echo.
echo [Backend] Iniciando na porta 3001...
start "CertificadoPro - Backend" cmd /c "cd /d "%~dp0backend" && node server.js"

echo [Frontend] Iniciando na porta 5173...
start "CertificadoPro - Frontend" cmd /c "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================
echo   Aplicacao iniciada!
echo.
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3001
echo   Validar:  http://localhost:5173/validar
echo.
echo   Feche esta janela para parar tudo.
echo ========================================
echo.

timeout /t 5 /nobreak >nul
start http://localhost:5173

echo Pressione qualquer tecla para encerrar os servidores...
pause >nul

echo Encerrando servidores...
taskkill /FI "WINDOWTITLE eq CertificadoPro - Backend" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq CertificadoPro - Frontend" /F >nul 2>&1
echo Servidores encerrados.
