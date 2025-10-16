#!/bin/bash

# =====================================================
# Sci Market Database Installation Script
# =====================================================
# This script installs the complete database schema
# Author: BlueUp Team
# Date: 2025-09-28
# =====================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DB_NAME="sci_market"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if PostgreSQL is running
check_postgresql() {
    print_status "Checking PostgreSQL connection..."
    
    if ! command -v psql &> /dev/null; then
        print_error "PostgreSQL client (psql) is not installed!"
        exit 1
    fi
    
    if ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER &> /dev/null; then
        print_error "PostgreSQL server is not running or not accessible!"
        print_error "Please ensure PostgreSQL is running on $DB_HOST:$DB_PORT"
        exit 1
    fi
    
    print_success "PostgreSQL is running and accessible"
}

# Function to create database
create_database() {
    print_status "Creating database '$DB_NAME'..."
    
    # Check if database exists
    if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
        print_warning "Database '$DB_NAME' already exists"
        read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status "Dropping existing database..."
            psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "DROP DATABASE IF EXISTS $DB_NAME;"
            print_status "Creating new database..."
            psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "CREATE DATABASE $DB_NAME;"
        else
            print_warning "Using existing database"
        fi
    else
        psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "CREATE DATABASE $DB_NAME;"
    fi
    
    print_success "Database '$DB_NAME' is ready"
}

# Function to execute SQL file
execute_sql_file() {
    local file=$1
    local description=$2
    
    if [ ! -f "$file" ]; then
        print_error "SQL file not found: $file"
        exit 1
    fi
    
    print_status "Executing: $description"
    if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$file" > /dev/null 2>&1; then
        print_success "Completed: $description"
    else
        print_error "Failed to execute: $description"
        print_error "Check the SQL file for syntax errors: $file"
        exit 1
    fi
}

# Function to verify installation
verify_installation() {
    print_status "Verifying installation..."
    
    # Check tables
    local table_count=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
    
    # Check functions
    local function_count=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public';" | tr -d ' ')
    
    # Check views
    local view_count=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public';" | tr -d ' ')
    
    # Check indexes
    local index_count=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public';" | tr -d ' ')
    
    print_success "Installation verification:"
    echo "  - Tables: $table_count"
    echo "  - Functions: $function_count"
    echo "  - Views: $view_count"
    echo "  - Indexes: $index_count"
    
    # Check sample data
    local user_count=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM users;" | tr -d ' ')
    local product_count=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM products;" | tr -d ' ')
    local category_count=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM categories;" | tr -d ' ')
    
    print_success "Sample data loaded:"
    echo "  - Users: $user_count"
    echo "  - Products: $product_count"
    echo "  - Categories: $category_count"
}

# Function to show connection info
show_connection_info() {
    print_success "Database installation completed successfully!"
    echo
    echo "Connection information:"
    echo "  Host: $DB_HOST"
    echo "  Port: $DB_PORT"
    echo "  Database: $DB_NAME"
    echo "  User: $DB_USER"
    echo
    echo "Connection string:"
    echo "  postgresql://$DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"
    echo
    echo "Default admin user:"
    echo "  Username: admin"
    echo "  Password: password123"
    echo "  Email: admin@sci-market.ir"
    echo
    print_warning "Please change the default password in production!"
}

# Main installation function
main() {
    echo "====================================================="
    echo "Sci Market Database Installation Script"
    echo "====================================================="
    echo
    
    # Check if we're in the right directory
    if [ ! -f "01_create_enums.sql" ]; then
        print_error "Please run this script from the database directory"
        print_error "Expected files: 01_create_enums.sql, 02_create_tables.sql, etc."
        exit 1
    fi
    
    # Check PostgreSQL
    check_postgresql
    
    # Create database
    create_database
    
    # Execute SQL files in order
    execute_sql_file "01_create_enums.sql" "Creating ENUM types"
    execute_sql_file "02_create_tables.sql" "Creating tables"
    execute_sql_file "03_create_indexes.sql" "Creating indexes"
    execute_sql_file "04_create_triggers.sql" "Creating triggers"
    execute_sql_file "05_create_functions.sql" "Creating functions"
    execute_sql_file "06_create_views.sql" "Creating views"
    execute_sql_file "07_seed_data.sql" "Loading seed data"
    
    # Verify installation
    verify_installation
    
    # Show connection info
    show_connection_info
    
    echo
    print_success "Installation completed successfully!"
    echo "You can now connect to the database and start using the Sci Market system."
}

# Handle command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--host)
            DB_HOST="$2"
            shift 2
            ;;
        -p|--port)
            DB_PORT="$2"
            shift 2
            ;;
        -U|--user)
            DB_USER="$2"
            shift 2
            ;;
        -d|--database)
            DB_NAME="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo
            echo "Options:"
            echo "  -h, --host HOST      Database host (default: localhost)"
            echo "  -p, --port PORT      Database port (default: 5432)"
            echo "  -U, --user USER      Database user (default: postgres)"
            echo "  -d, --database NAME  Database name (default: sci_market)"
            echo "  --help               Show this help message"
            echo
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Run main function
main
















