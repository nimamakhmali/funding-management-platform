@echo off
REM =====================================================
REM Sci Market Database Installation Script (Windows)
REM =====================================================
REM This script installs the complete database schema
REM Author: BlueUp Team
REM Date: 2025-10-16
REM =====================================================

setlocal enabledelayedexpansion

REM Configuration
set DB_NAME=sci_market
set DB_USER=postgres
set DB_HOST=localhost
set DB_PORT=5432

REM Colors (Windows doesn't support colors in batch, so we'll use text)
set INFO=[INFO]
set SUCCESS=[SUCCESS]
set WARNING=[WARNING]
set ERROR=[ERROR]

echo =====================================================
echo Sci Market Database Installation Script
echo =====================================================
echo.

REM Check if we're in the right directory
if not exist "01_create_enums.sql" (
    echo %ERROR% Please run this script from the database directory
    echo %ERROR% Expected files: 01_create_enums.sql, 02_create_tables.sql, etc.
    pause
    exit /b 1
)

REM Check if PostgreSQL is available
echo %INFO% Checking PostgreSQL connection...
psql --version >nul 2>&1
if errorlevel 1 (
    echo %ERROR% PostgreSQL client (psql) is not installed or not in PATH!
    echo %ERROR% Please install PostgreSQL and add it to your PATH
    pause
    exit /b 1
)

REM Test connection
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -c "SELECT version();" >nul 2>&1
if errorlevel 1 (
    echo %ERROR% Cannot connect to PostgreSQL server!
    echo %ERROR% Please ensure PostgreSQL is running on %DB_HOST%:%DB_PORT%
    echo %ERROR% and user '%DB_USER%' has proper permissions
    pause
    exit /b 1
)

echo %SUCCESS% PostgreSQL is running and accessible

REM Create database
echo %INFO% Creating database '%DB_NAME%'...

REM Check if database exists
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -lqt | findstr /C:"%DB_NAME%" >nul
if not errorlevel 1 (
    echo %WARNING% Database '%DB_NAME%' already exists
    set /p "choice=Do you want to drop and recreate it? (y/N): "
    if /i "!choice!"=="y" (
        echo %INFO% Dropping existing database...
        psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -c "DROP DATABASE IF EXISTS %DB_NAME%;"
        echo %INFO% Creating new database...
        psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -c "CREATE DATABASE %DB_NAME%;"
    ) else (
        echo %WARNING% Using existing database
    )
) else (
    psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -c "CREATE DATABASE %DB_NAME%;"
)

echo %SUCCESS% Database '%DB_NAME%' is ready

REM Execute SQL files in order
echo %INFO% Executing: Creating ENUM types
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "01_create_enums.sql"
if errorlevel 1 (
    echo %ERROR% Failed to execute: Creating ENUM types
    pause
    exit /b 1
)
echo %SUCCESS% Completed: Creating ENUM types

echo %INFO% Executing: Creating tables
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "02_create_tables.sql"
if errorlevel 1 (
    echo %ERROR% Failed to execute: Creating tables
    pause
    exit /b 1
)
echo %SUCCESS% Completed: Creating tables

echo %INFO% Executing: Creating indexes
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "03_create_indexes.sql"
if errorlevel 1 (
    echo %ERROR% Failed to execute: Creating indexes
    pause
    exit /b 1
)
echo %SUCCESS% Completed: Creating indexes

echo %INFO% Executing: Creating triggers
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "04_create_triggers.sql"
if errorlevel 1 (
    echo %ERROR% Failed to execute: Creating triggers
    pause
    exit /b 1
)
echo %SUCCESS% Completed: Creating triggers

echo %INFO% Executing: Creating functions
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "05_create_functions.sql"
if errorlevel 1 (
    echo %ERROR% Failed to execute: Creating functions
    pause
    exit /b 1
)
echo %SUCCESS% Completed: Creating functions

echo %INFO% Executing: Creating views
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "06_create_views.sql"
if errorlevel 1 (
    echo %ERROR% Failed to execute: Creating views
    pause
    exit /b 1
)
echo %SUCCESS% Completed: Creating views

echo %INFO% Executing: Loading seed data
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "07_seed_data.sql"
if errorlevel 1 (
    echo %ERROR% Failed to execute: Loading seed data
    pause
    exit /b 1
)
echo %SUCCESS% Completed: Loading seed data

REM Verify installation
echo %INFO% Verifying installation...

REM Check tables
for /f %%i in ('psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"') do set table_count=%%i
set table_count=%table_count: =%

REM Check functions
for /f %%i in ('psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -t -c "SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public';"') do set function_count=%%i
set function_count=%function_count: =%

REM Check views
for /f %%i in ('psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -t -c "SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public';"') do set view_count=%%i
set view_count=%view_count: =%

REM Check indexes
for /f %%i in ('psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -t -c "SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public';"') do set index_count=%%i
set index_count=%index_count: =%

echo %SUCCESS% Installation verification:
echo   - Tables: %table_count%
echo   - Functions: %function_count%
echo   - Views: %view_count%
echo   - Indexes: %index_count%

REM Check sample data
for /f %%i in ('psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -t -c "SELECT COUNT(*) FROM users;"') do set user_count=%%i
set user_count=%user_count: =%

for /f %%i in ('psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -t -c "SELECT COUNT(*) FROM products;"') do set product_count=%%i
set product_count=%product_count: =%

for /f %%i in ('psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -t -c "SELECT COUNT(*) FROM categories;"') do set category_count=%%i
set category_count=%category_count: =%

echo %SUCCESS% Sample data loaded:
echo   - Users: %user_count%
echo   - Products: %product_count%
echo   - Categories: %category_count%

REM Show connection info
echo.
echo %SUCCESS% Database installation completed successfully!
echo.
echo Connection information:
echo   Host: %DB_HOST%
echo   Port: %DB_PORT%
echo   Database: %DB_NAME%
echo   User: %DB_USER%
echo.
echo Connection string:
echo   postgresql://%DB_USER%@%DB_HOST%:%DB_PORT%/%DB_NAME%
echo.
echo Default admin user:
echo   Username: admin
echo   Password: password123
echo   Email: admin@sci-market.ir
echo.
echo %WARNING% Please change the default password in production!
echo.
echo %SUCCESS% Installation completed successfully!
echo You can now connect to the database and start using the Sci Market system.
echo.
pause
















