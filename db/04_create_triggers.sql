-- Triggers for Sci Market

-- Update updated_at on row modification
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
DROP TRIGGER IF EXISTS trg_users_updated ON users;
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_categories_updated ON categories;
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_products_updated ON products;
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_carts_updated ON carts;
CREATE TRIGGER trg_carts_updated BEFORE UPDATE ON carts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated ON orders;
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_tickets_updated ON tickets;
CREATE TRIGGER trg_tickets_updated BEFORE UPDATE ON tickets
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_reviews_updated ON reviews;
CREATE TRIGGER trg_reviews_updated BEFORE UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Auto create wallet on new user
CREATE OR REPLACE FUNCTION create_wallet_for_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO wallets (user_id, balance, transaction_history)
    VALUES (NEW.id, 0, '[]'::jsonb)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_create_wallet ON users;
CREATE TRIGGER trg_users_create_wallet AFTER INSERT ON users
FOR EACH ROW EXECUTE FUNCTION create_wallet_for_user();

-- Ensure order total consistency
CREATE OR REPLACE FUNCTION enforce_order_totals()
RETURNS TRIGGER AS $$
DECLARE
    calc_total NUMERIC(12,2);
BEGIN
    SELECT COALESCE(SUM(total_price), 0) INTO calc_total
    FROM order_items WHERE order_id = NEW.order_id;
    UPDATE orders SET total_price = calc_total, updated_at = NOW() WHERE id = NEW.order_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_order_items_after_change ON order_items;
CREATE TRIGGER trg_order_items_after_change AFTER INSERT OR UPDATE OR DELETE ON order_items
FOR EACH ROW EXECUTE FUNCTION enforce_order_totals();

-- Increment product views/downloads helpers (used by app too)
CREATE OR REPLACE FUNCTION increment_product_views(p_product_id BIGINT) RETURNS VOID AS $$
BEGIN
    UPDATE products SET views_count = views_count + 1 WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_product_downloads(p_product_id BIGINT) RETURNS VOID AS $$
BEGIN
    UPDATE products SET download_count = download_count + 1 WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql;

-- TRIGGERS FUNCTIONS

-- function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';


-- function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number = 'ORD-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT)FROM 1 FOR 8));
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';



-- function to create wallet for new user
CREATE OR REPLACE FUNCTION create_user_wallet()
RETURNS TRIGGER AS $$
BEGIN 
    INSERT INTO wallets (user_id, balance) VALUES (NEW.id, 0.00);
    RETURN NEW;
END;
$$ language 'plpgsql';


-- Function to update order total when order items change
CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
DECLARE
    new_total DECIMAL(10, 2);
BEGIN
    -- calculate new total
    SELECT COALESCE(SUM(total_price), 0) INTO new_total
    FROM order_items
    WHERE order_id = COALESCE(NEW.order_id, ODL.order_id);

    --update order total
    UPDATE orders 
    SET total_price = new_total,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = COALESCE(NEW.order_id, OLD.order_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';




-- function to update product statistics
CREATE OR REPLACE FUNCTION update_product_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update download count
    IF TG_OP = 'INSERT' AND NEW.status = 'completed' AND NEW.type = 'purchase' THEN
        UPDATE products
        SET download_count = download_count + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id IN (
            SELECT oi.product_id
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            WHERE o.id = NEW.id
        );
    END IF;       
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';





-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
DECLARE
    audit_action VARCHAR(100);
    audit_details JSONB;
BEGIN
    -- determine action type
    IF TG_OP = 'INSERT' THEN
        audit_action := 'create_' || TG_TABLE_NAME;
    ELSEIF TG_OP = 'UPDATE' THEN
        audit_action := 'update_' || TG_TABLE_NAME;
    ELSEIF TG_OP = 'DELETE' THEN
        audit_action := 'delete_' || TG_TABLE_NAME;
    END IF;

    -- build details JSON
    audit_details := jsonb_build_object(
        'table', TG_TABLE_NAME,
        'operation', TG_OP,
        'record_id', COALESCE(NEW.id, OLD.id)
    );


    -- Add relevant fields based on table
    IF TG_TABLE_NAME = 'users' THEN
        audit_details := audit_details || jsonb_build_object(
            'email', COALESCE(NEW.email, OLD.email),
            'role', COALESCE(NEW.role, OLD.role)
        );
    ELSIF TG_TABLE_NAME = 'products' THEN
        audit_details := audit_details || jsonb_build_object(
            'title', COALESCE(NEW.title_fa, OLD.title_fa),
            'price', COALESCE(NEW.price, OLD.price)
        );
    ELSIF TG_TABLE_NAME = 'orders' THEN
        audit_details := audit_details || jsonb_build_object(
            'order_number', COALESCE(NEW.order_number, OLD.order_number),
            'total_price', COALESCE(NEW.total_price, OLD.total_price)
        );
    ELSIF TG_TABLE_NAME = 'transactions' THEN
        audit_details := audit_details || jsonb_build_object(
            'amount', COALESCE(NEW.amount, OLD.amount),
            'type', COALESCE(NEW.type, OLD.type),
            'status', COALESCE(NEW.status, OLD.status)
        );
    END IF;
    
    -- Insert audit log
    INSERT INTO audit_logs (user_id, action, details)
    VALUES (
        COALESCE(NEW.seller_id,
        NEW.buyer_id, 
        NEW.user_id, 
        OLD.seller_id, 
        OLD.buyer_id, 
        OLD.user_id ),
        audit_action,
        audit_details
    );
    
    RETURN COALESCE(NEW, OLD);    

END;
$$ language 'plpgsql';




-- Function to validate wallet transactions
CREATE OR REPLACE FUNCTION validate_wallet_transaction()
RETURNS TRIGGER AS $$
DECLARE
    from_balance DECIMAL(12,2);
    to_balance DECIMAL(12,2);
BEGIN
    -- Check if this is a transfer transaction
    IF NEW.type = 'transfer' THEN
        -- Get current balances
        SELECT balance INTO from_balance FROM wallets WHERE id = NEW.from_wallet_id;
        SELECT balance INTO to_balance FROM wallets WHERE id = NEW.to_wallet_id;
        
        -- Validate sufficient balance
        IF from_balance < NEW.amount THEN
            RAISE EXCEPTION 'Insufficient wallet balance. Available: %, Required: %', from_balance, NEW.amount;
        END IF;
        
        -- Update balances atomically
        UPDATE wallets SET balance = balance - NEW.amount WHERE id = NEW.from_wallet_id;
        UPDATE wallets SET balance = balance + NEW.amount WHERE id = NEW.to_wallet_id;
        
        -- Update transaction history in both wallets
        UPDATE wallets 
        SET transaction_history = transaction_history || jsonb_build_object(
            'type', 'transfer_out',
            'amount', NEW.amount,
            'to_wallet_id', NEW.to_wallet_id,
            'timestamp', CURRENT_TIMESTAMP,
            'balance_after', from_balance - NEW.amount
        )
        WHERE id = NEW.from_wallet_id;
        
        UPDATE wallets 
        SET transaction_history = transaction_history || jsonb_build_object(
            'type', 'transfer_in',
            'amount', NEW.amount,
            'from_wallet_id', NEW.from_wallet_id,
            'timestamp', CURRENT_TIMESTAMP,
            'balance_after', to_balance + NEW.amount
        )
        WHERE id = NEW.to_wallet_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';




-- Triggers

--update timestamps triggers
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_wallets_updated_at
    BEFORE UPDATE ON wallets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_carts_updated_at
    BEFORE UPDATE ON carts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_tickets_updated_at
    BEFORE UPDATE ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Order number generation trigger
CREATE TRIGGER trigger_orders_generate_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_number();

-- User wallet creation trigger
CREATE TRIGGER trigger_users_create_wallet
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_wallet();

-- Order total update triggers
CREATE TRIGGER trigger_order_items_update_total
    AFTER INSERT OR UPDATE OR DELETE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_order_total();

-- Product statistics update trigger
CREATE TRIGGER trigger_orders_update_product_stats
    AFTER INSERT OR UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_product_stats();

-- Wallet transaction validation trigger
CREATE TRIGGER trigger_transactions_validate_wallet
    BEFORE INSERT ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION validate_wallet_transaction();

-- Audit logging triggers (selective - only for important tables)
CREATE TRIGGER trigger_users_audit
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW
    EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER trigger_products_audit
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW
    EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER trigger_orders_audit
    AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER trigger_transactions_audit
    AFTER INSERT OR UPDATE OR DELETE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION log_audit_event();


-- COMMENTS ON TRIGGERS

COMMENT ON FUNCTION update_updated_at_column() IS 'Automatically updates the updated_at timestamp';
COMMENT ON FUNCTION generate_order_number() IS 'Generates unique order numbers';
COMMENT ON FUNCTION create_user_wallet() IS 'Creates a wallet for new users';
COMMENT ON FUNCTION update_order_total() IS 'Updates order total when items change';
COMMENT ON FUNCTION update_product_stats() IS 'Updates product download statistics';
COMMENT ON FUNCTION log_audit_event() IS 'Logs audit events for security and compliance';
COMMENT ON FUNCTION validate_wallet_transaction() IS 'Validates and processes wallet transactions atomically';


