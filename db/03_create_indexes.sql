
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