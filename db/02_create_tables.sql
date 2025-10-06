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
