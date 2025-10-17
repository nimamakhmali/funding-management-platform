-- Core tables for Sci Market
-- Assumes 01_create_enums.sql loaded

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users
CREATE TABLE IF NOT EXISTS users (
    id              BIGSERIAL PRIMARY KEY,
    username        VARCHAR(50) UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    email           VARCHAR(100) UNIQUE NOT NULL,
    phone           VARCHAR(20) UNIQUE,
    role            user_role NOT NULL DEFAULT 'buyer',
    full_name       VARCHAR(100),
    profile_picture VARCHAR(255),
    language_preference language_preference NOT NULL DEFAULT 'fa',
    theme_preference    theme_preference NOT NULL DEFAULT 'light',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_staff        BOOLEAN NOT NULL DEFAULT FALSE,
    is_superuser    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login      TIMESTAMPTZ
);

-- User roles (RBAC)
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role    user_role NOT NULL,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    assigned_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    PRIMARY KEY (user_id, role)
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
    id          BIGSERIAL PRIMARY KEY,
    name_fa     VARCHAR(100) NOT NULL,
    name_en     VARCHAR(100) NOT NULL,
    slug        VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    parent_id   BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
    id              BIGSERIAL PRIMARY KEY,
    seller_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title_fa        VARCHAR(200) NOT NULL,
    title_en        VARCHAR(200),
    slug            VARCHAR(220) UNIQUE NOT NULL,
    description_fa  TEXT NOT NULL,
    description_en  TEXT,
    category_id     BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    price           NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    file_path       VARCHAR(255),
    file_type       file_type,
    tags            JSONB,
    views_count     BIGINT NOT NULL DEFAULT 0,
    download_count  BIGINT NOT NULL DEFAULT 0,
    preview_image   VARCHAR(255),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Product files
CREATE TABLE IF NOT EXISTS product_files (
    id          BIGSERIAL PRIMARY KEY,
    product_id  BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    file_path   VARCHAR(255) NOT NULL,
    file_name   VARCHAR(120) NOT NULL,
    file_size   BIGINT CHECK (file_size <= 50*1024*1024), -- 50MB
    upload_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Carts
CREATE TABLE IF NOT EXISTS carts (
    id         BIGSERIAL PRIMARY KEY,
    buyer_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cart items
CREATE TABLE IF NOT EXISTS cart_items (
    id         BIGSERIAL PRIMARY KEY,
    cart_id    BIGINT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity   INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    added_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (cart_id, product_id)
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id             BIGSERIAL PRIMARY KEY,
    buyer_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_number   VARCHAR(40) UNIQUE NOT NULL DEFAULT CONCAT('ORD-', substr(replace(uuid_generate_v4()::TEXT,'-',''),1,12)),
    total_price    NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (total_price >= 0),
    status         order_status NOT NULL DEFAULT 'pending',
    payment_method payment_method,
    tracking_code  VARCHAR(50),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
    id               BIGSERIAL PRIMARY KEY,
    order_id         BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id       BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity         INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price            NUMERIC(12,2) NOT NULL,
    total_price      NUMERIC(12,2) NOT NULL,
    UNIQUE (order_id, product_id)
);

-- Wallets
CREATE TABLE IF NOT EXISTS wallets (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    balance     NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
    transaction_history JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
    id           BIGSERIAL PRIMARY KEY,
    from_wallet  BIGINT REFERENCES wallets(id) ON DELETE SET NULL,
    to_wallet    BIGINT REFERENCES wallets(id) ON DELETE SET NULL,
    amount       NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    transaction_type transaction_type NOT NULL,
    status       transaction_status NOT NULL DEFAULT 'pending',
    description  TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tickets
CREATE TABLE IF NOT EXISTS tickets (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject     VARCHAR(200) NOT NULL,
    message     TEXT NOT NULL,
    status      ticket_status NOT NULL DEFAULT 'open',
    assigned_to BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ticket responses
CREATE TABLE IF NOT EXISTS ticket_responses (
    id         BIGSERIAL PRIMARY KEY,
    ticket_id  BIGINT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message    TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id         BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment    TEXT,
    is_verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (product_id, user_id)
);

-- Wishlists
CREATE TABLE IF NOT EXISTS wishlists (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    added_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, product_id)
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action     VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    details    JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1. User Table
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    role user_role NOT NULL DEFAULT 'buyer',
    full_name VARCHAR(100) NOT NULL,
    profile_picture VARCHAR(255),
    language_preference language_preference DEFAULT 'fa',
    theme_preference theme_preference DEFAULT 'light',
    is_active BOOLEAN DEFAULT TRUE,
    --is_staff BOOLEAN DEFAULT FALSE,
    --is_superuser BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,

    CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
    CONSTRAINT users_phone_format CHECK (phone IS NULL OR phone ~* '^[0-9+\-\s()]+$'),
    CONSTRAINT users_username_length CHECK (LENGTH(username) >= 3),
    CONSTRAINT users_full_name_length CHECK (LENGTH(full_name) >= 2)
);



-- 2. User Roles Table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    assigned_by INTEGER REFERENCES users(id) ON DELETE SET NULL,

    -- CONSTRAINTS
    UNIQUE(user_id, role_id)
);


-- 3. CATEGORIES Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name_fa VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Constraints
    CONSTRAINT categories_name_fa_length CHECK (LENGTH(name_fa) >= 2),
    CONSTRAINT categories_name_en_length CHECK (LENGTH(name_en) >= 2),
    CONSTRAINT categories_slug_format CHECK (slug ~* '^[a-z0-9-]+$'),
    CONSTRAINT categories_parent_slug_unique UNIQUE (parent_id, slug)
);

-- 4.Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title_fa VARCHAR(200) NOT NULL,
    title_en VARCHAR(200),
    slug VARCHAR(200) NOT NULL,
    description_fa TEXT NOT NULL,
    description_en TEXT,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    file_path VARCHAR(255),
    file_type file_type DEFAULT 'other',
    tags JSONB DEFAULT '[]'::jsonb,
    views_count INTEGER DEFAULT 0,
    preview_image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT products_title_fa_length CHECK (LENGTH(title_fa) >= 3),
    CONSTRAINT products_slug_format CHECK (slug ~* '^[a-z0-9-]+$'),
    CONSTRAINT products_views_count_positive CHECK (views_count >= 0),
    CONSTRAINT products_download_count_positive CHECK (download_count >= 0),
    CONSTRAINT products_seller_slug_unique UNIQUE(seller_id, slug)
);


--5.Product files table
CREATE TABLE product_files (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    file_path VARCHAR(255) NOT NULL,
    file_name VARCHAR(100) NOT NULL,
    mime_type VARCHAR(100),
    file_size INTEGER NOT NULL CHECK (file_size > 0 AND file_size <= 52428800), -- 50MB
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT product_files_name_length CHECK (LENGTH(file_name) >= 1),
    CONSTRAINT product_files_path_format CHECK (file_path ~* '^[A-Za-z0-9_\-./]+$'),
    UNIQUE(product_id, file_name)
);

-- For faster access Index 
CREATE INDEX idx_product_files_product_id ON product_files(product_id);


-- 6.wallet table
CREATE TABLE wallets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wallets_user_id ON wallets(user_id);


-- 7. transaction table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    from_wallet_id INTEGER REFERENCES wallets(id) ON DELETE SET NULL,
    to_wallet_id INTEGER REFERENCES wallets(id) ON DELETE SET NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    type transaction_type NOT NULL,
    status transaction_status DEFAULT 'pending',
    description TEXT,
    reference_id VARCHAR(100),
    balance_after_from DECIMAL(12,2),
    balance_after_to DECIMAL(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT transactions_transfer_wallets CHECK (
        (type = 'transfer' AND from_wallet_id IS NOT NULL AND to_wallet_id IS NOT NULL AND from_wallet_id != to_wallet_id) OR
        (type != 'transfer')
    )
);

-- Indexes
CREATE INDEX idx_transactions_from_wallet ON transactions(from_wallet_id);
CREATE INDEX idx_transactions_to_wallet ON transactions(to_wallet_id);
CREATE INDEX idx_transactions_status ON transactions(status);


-- 8. CARTS TABLE
CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    buyer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    total_price DECIMAL(12,2) DEFAULT 0 CHECK (total_price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_carts_buyer_active ON carts(buyer_id, is_active);


-- 9. CART ITEMS TABLE
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(12,2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE(cart_id, product_id)
);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);

-- 10. orders tables
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    buyer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    cart_id INTEGER REFERENCES carts(id) ON DELETE SET NULL,
    transaction_id INTEGER REFERENCES transactions(id) ON DELETE SET NULL,
    total_price DECIMAL(12,2) NOT NULL CHECK (total_price >= 0),
    discount_amount DECIMAL(12,2) DEFAULT 0 CHECK (discount_amount >= 0),
    final_price DECIMAL(12,2) GENERATED ALWAYS AS (total_price - discount_amount) STORED,
    status order_status DEFAULT 'pending',
    payment_method payment_method DEFAULT 'wallet',
    tracking_code VARCHAR(50),
    notes TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT orders_order_number_format CHECK (order_number ~* '^ORD-[A-Z0-9]+$')
);


-- 11. order items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
    total_price DECIMAL(12,2) GENERATED ALWAYS AS (quantity * price) STORED,
    access_granted BOOLEAN DEFAULT FALSE,
    download_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(order_id, product_id)
);

-- 12. TICKETS TABLE
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status ticket_status DEFAULT 'open',
    priority ticket_priority DEFAULT 'medium',
    source ticket_source DEFAULT 'web',
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT tickets_subject_length CHECK (LENGTH(subject) >= 5),
    CONSTRAINT tickets_message_length CHECK (LENGTH(message) >= 10)
);


-- 13. TICKET RESPONSES TABLE
CREATE TABLE ticket_responses (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_staff_response BOOLEAN DEFAULT FALSE,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT ticket_responses_message_length CHECK (LENGTH(message) >= 5)
);


-- 14. REVIEWS TABLE
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE(product_id, user_id),
    CONSTRAINT reviews_comment_length CHECK (comment IS NULL OR LENGTH(comment) >= 10)
);

-- 15. WISHLISTS TABLE
CREATE TABLE wishlists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE(user_id, product_id)
);


-- 16. AUDIT LOGS TABLE
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    ip_address INET,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT audit_logs_action_length CHECK (LENGTH(action) >= 2)
);


-- COMMENTS ON TABLES
COMMENT ON TABLE users IS 'User accounts with authentication and profile information';
COMMENT ON TABLE user_roles IS 'Role-Based Access Control (RBAC) assignments';
COMMENT ON TABLE categories IS 'Product categories with hierarchical structure';
COMMENT ON TABLE products IS 'Scientific products available for purchase';
COMMENT ON TABLE product_files IS 'Additional files associated with products';
COMMENT ON TABLE wallets IS 'User digital wallets for transactions';
COMMENT ON TABLE transactions IS 'Wallet transaction history';
COMMENT ON TABLE carts IS 'Shopping carts for users';
COMMENT ON TABLE cart_items IS 'Items in shopping carts';
COMMENT ON TABLE orders IS 'Purchase orders';
COMMENT ON TABLE order_items IS 'Items within orders';
COMMENT ON TABLE tickets IS 'Support tickets';
COMMENT ON TABLE ticket_responses IS 'Responses to support tickets';
COMMENT ON TABLE reviews IS 'Product reviews and ratings';
COMMENT ON TABLE wishlists IS 'User wishlists/favorites';
COMMENT ON TABLE audit_logs IS 'System audit trail for security and compliance';

