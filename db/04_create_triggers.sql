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

