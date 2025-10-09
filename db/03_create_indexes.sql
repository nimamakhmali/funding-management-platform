
--Users

--primary lookup indexes
CREATE INDEX idx_users_email    ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_phone    ON users(phone) WHERE phone IS NOT NULL;


--Role_based queries
CREATE INDEX idx_users_role        ON users(role);
CREATE INDEX idx_users_role_active ON users(role, is_active) WHERE is_active = TRUE;


-- Authentication and security
CREATE INDEX idx_users_last_login ON users(last_login) WHERE last_login IS NOT NULL;
CREATE INDEX idx_users_created_at ON users(created_at);


--User Roles

-- Role assignment
CREATE INDEX idx_users_role_user_id     ON user_roles(user_id);
CREATE INDEX idx_user_roles_role        ON user_roles(role);
CREATE INDEX idx_user_roles_assigned_at ON user_roles(assigned_at);

-- categories

-- Hierarchical queries
CREATE INDEX idx_categories_parent_id ON categories(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX idx_categories_slug      ON categories(slug);
CREATE INDEX idx_categories_active    ON categories(active) WHERE active = TRUE;
CREATE INDEX idx_categories_order     ON categories(order_index);

-- Full-text search on category names
CREATE INDEX idx_categories_name_fa_gin ON categories USING gin(to_tsvector('persian', name_fa));
CREATE INDEX idx_categories_name_en_gin ON categories USING gin(to_tsvector('english', name_en));

--products -> tables

-- Primary lookup indexes
CREATE INDEX idx_products_seller_id   ON products(seller_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_slug        ON products(slug);

-- Status and visibility
CREATE INDEX idx_products_is_active       ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_products_featured        ON products(featured) WHERE featured = TRUE;
CREATE INDEX idx_products_active_featured ON products(is_active, featured) WHERE is_active = TRUE AND featured = TRUE;

-- Price and sorting
CREATE INDEX idx_products_price      ON products(price);
CREATE INDEX idx_products_created_at ON products(created_at);
CREATE INDEX idx_products_updated_at ON products(updated_at);

-- Statistics
CREATE INDEX idx_products_views_count ON products(views_count);
CREATE INDEX idx_products_download_count ON products(download_count);

-- File type filtering
CREATE INDEX idx_products_file_type ON products(file_type);

-- Full-text search on product content
CREATE INDEX idx_products_title_fa_gin ON products USING gin(to_tsvector('persian', title_fa));
CREATE INDEX idx_products_title_en_gin ON products USING gin(to_tsvector('english', title_en));
CREATE INDEX idx_products_description_fa_gin ON products USING gin(to_tsvector('persian', description_fa));
CREATE INDEX idx_products_description_en_gin ON products USING gin(to_tsvector('english', description_en));

-- JSONB tags search
CREATE INDEX idx_products_tags_gin ON products USING gin(tags);

-- Composite indexes for common queries
CREATE INDEX idx_products_category_active_created ON products(category_id, is_active, created_at) WHERE is_active = TRUE;
CREATE INDEX idx_products_seller_active_created ON products(seller_id, is_active, created_at) WHERE is_active = TRUE;


-- products -> files tables

CREATE INDEX idx_product_files_product_id  ON product_files(product_id);
CREATE INDEX idx_product_files_upload_date ON product_files(upload_date);
CREATE INDEX idx_product_files_file_size   ON product_files(file_size);

--wallets 
CREATE INDEX idx_wallets_user_id    ON wallets(user_id);
CREATE INDEX idx_wallets_balance    ON wallets(balance);
CREATE INDEX idx_wallets_updated_at ON wallets(updated_at);


--transactions


--wallet-based queries
CREATE INDEX idx_transactions_from_wallet_id ON transactions(from_wallet_id) WHERE from_wallet_id IS NOT NULL;
CREATE INDEX idx_transactions_to_wallet_id   ON transactions(to_wallet_id) WHERE to_wallet_id IS NOT NULL;

--Transaction type and status
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type_status ON transactions(type, status);

--Time-based queries
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_amount     ON transactions(amount);

--Reference ID for external systems
CREATE INDEX idx_transactions_reference_id ON transactions(reference_id) WHERE reference_id IS NOT NULL;

-- Composite indexes for common queries
CREATE INDEX idx_transactions_wallet_created    ON transactions(from_wallet_id, created_at) WHERE from_wallet_id IS NOT NULL;
CREATE INDEX idx_transactions_wallet_to_created ON transactions(to_wallet_id, created_at) WHERE to_wallet_id IS NOT NULL;


-- carts table

CREATE INDEX idx_carts_buyer_id   ON carts(buyer_id);
CREATE INDEX idx_carts_created_at ON carts(created_at);
CREATE INDEX idx_carts_updated_at ON carts(updated_at);

-- carts item tables
CREATE INDEX idx_cart_items_cart_id    ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX idx_cart_items_added_at   ON cart_items(added_at);


-- ORDERS TABLE INDEXES

-- Primary lookup
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- Status and processing
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_method ON orders(payment_method) WHERE payment_method IS NOT NULL;
CREATE INDEX idx_orders_status_created ON orders(status, created_at);

-- Time-based queries
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_updated_at ON orders(updated_at);

-- Tracking
CREATE INDEX idx_orders_tracking_code ON orders(tracking_code) WHERE tracking_code IS NOT NULL;


-- ORDER ITEMS TABLE INDEXES

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_order_items_price ON order_items(price);

