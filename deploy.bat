@echo off
echo ================================
echo Dentist Appointment Deployment
echo ================================

echo.
echo 1. Building frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo Frontend build failed!
    pause
    exit /b 1
)

echo.
echo 2. Frontend built successfully!
echo Built files are in: frontend/dist/

echo.
echo 3. Backend is ready for deployment
echo Backend files are in: backend/

echo.
echo ================================
echo Deployment Preparation Complete!
echo ================================
echo.
echo Next steps:
echo 1. Upload frontend/dist/ contents to your domain's public_html/
echo 2. Upload backend/ folder to your server
echo 3. Configure environment variables
echo 4. Install dependencies: npm install --production
echo 5. Start the server: npm start
echo.
echo See DEPLOYMENT_GUIDE.md for detailed instructions
echo.
pause
