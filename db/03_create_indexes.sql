-- Indexes for performance optimization

-- Users
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Categories
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

-- Products
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_tags_gin ON products USING GIN (tags);

-- Full text search (Persian/English combined)
CREATE INDEX IF NOT EXISTS idx_products_fts ON products USING GIN (
    to_tsvector('simple', coalesce(title_fa,'') || ' ' || coalesce(title_en,'') || ' ' || coalesce(description_fa,'') || ' ' || coalesce(description_en,''))
);

-- Orders
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Order items
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- Wallets
CREATE INDEX IF NOT EXISTS idx_wallets_user ON wallets(user_id);

-- Transactions
CREATE INDEX IF NOT EXISTS idx_transactions_from ON transactions(from_wallet);
CREATE INDEX IF NOT EXISTS idx_transactions_to ON transactions(to_wallet);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at);

-- Tickets
CREATE INDEX IF NOT EXISTS idx_tickets_user ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned ON tickets(assigned_to);

-- Reviews
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Wishlists
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product ON wishlists(product_id);

-- Audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);


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


--User Roles tables indexes

-- Role assignment
CREATE INDEX idx_users_role_user_id     ON user_roles(user_id);
CREATE INDEX idx_user_roles_role        ON user_roles(role);
CREATE INDEX idx_user_roles_assigned_at ON user_roles(assigned_at);

-- categories table indexes

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

-- wallets table indexes

CREATE INDEX idx_wallets_user_id    ON wallets(user_id);
CREATE INDEX idx_wallets_balance    ON wallets(balance);
CREATE INDEX idx_wallets_updated_at ON wallets(updated_at);


-- transactions table indexes

-- Wallet-based queries
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



-- TICKETS TABLE INDEXES

-- User and assignment
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to) WHERE assigned_to IS NOT NULL;

-- Status and processing
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_status_created ON tickets(status, created_at);

-- Time-based queries
CREATE INDEX idx_tickets_created_at ON tickets(created_at);
CREATE INDEX idx_tickets_updated_at ON tickets(updated_at);

-- Full-text search on ticket content
CREATE INDEX idx_tickets_subject_gin ON tickets USING gin(to_tsvector('persian', subject));
CREATE INDEX idx_tickets_message_gin ON tickets USING gin(to_tsvector('persian', message));


-- TICKET RESPONSES TABLE INDEXES

CREATE INDEX idx_ticket_responses_ticket_id ON ticket_responses(ticket_id);
CREATE INDEX idx_ticket_responses_user_id ON ticket_responses(user_id);
CREATE INDEX idx_ticket_responses_created_at ON ticket_responses(created_at);



-- REVIEWS TABLE INDEXES


-- Product and user lookups
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

-- Rating and verification
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_verified ON reviews(is_verified_purchase) WHERE is_verified_purchase = TRUE;

-- Time-based queries
CREATE INDEX idx_reviews_created_at ON reviews(created_at);

-- Composite indexes for product reviews
CREATE INDEX idx_reviews_product_rating ON reviews(product_id, rating);
CREATE INDEX idx_reviews_product_created ON reviews(product_id, created_at);


-- WISHLISTS TABLE INDEXES


CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX idx_wishlists_product_id ON wishlists(product_id);
CREATE INDEX idx_wishlists_added_at ON wishlists(added_at);


-- AUDIT LOGS TABLE INDEXES


-- User and action queries
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- Time-based queries (most important for audit logs)
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_user_created ON audit_logs(user_id, created_at) WHERE user_id IS NOT NULL;

-- IP address queries
CREATE INDEX idx_audit_logs_ip_address ON audit_logs(ip_address) WHERE ip_address IS NOT NULL;

-- JSONB details search
CREATE INDEX idx_audit_logs_details_gin ON audit_logs USING gin(details);


-- PARTIAL INDEXES FOR PERFORMANCE


-- Active users only
CREATE INDEX idx_users_active_created ON users(created_at) WHERE is_active = TRUE;

-- Active products only
CREATE INDEX idx_products_active_price ON products(price) WHERE is_active = TRUE;

-- Completed transactions only
CREATE INDEX idx_transactions_completed_created ON transactions(created_at) WHERE status = 'completed';

-- Open tickets only
CREATE INDEX idx_tickets_open_created ON tickets(created_at) WHERE status = 'open';


-- COMMENTS ON INDEXES


COMMENT ON INDEX idx_products_title_fa_gin IS 'Full-text search index for Persian product titles';
COMMENT ON INDEX idx_products_title_en_gin IS 'Full-text search index for English product titles';
COMMENT ON INDEX idx_products_tags_gin IS 'GIN index for JSONB tags search';
COMMENT ON INDEX idx_audit_logs_details_gin IS 'GIN index for JSONB audit details search';
COMMENT ON INDEX idx_transactions_wallet_created IS 'Composite index for wallet transaction history';
COMMENT ON INDEX idx_products_category_active_created IS 'Composite index for category product listings';

