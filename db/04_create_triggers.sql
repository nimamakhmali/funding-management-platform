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
