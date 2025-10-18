-- Stored functions for Sci Market

-- Wallet operations are atomic via transactions
CREATE OR REPLACE FUNCTION add_wallet_funds(p_wallet BIGINT, p_amount NUMERIC, p_desc TEXT)
RETURNS VOID AS $$
BEGIN
    IF p_amount <= 0 THEN RAISE EXCEPTION 'Amount must be > 0'; END IF;
    UPDATE wallets SET balance = balance + p_amount, updated_at = NOW() WHERE id = p_wallet;
    INSERT INTO transactions (from_wallet, to_wallet, amount, transaction_type, status, description)
    VALUES (NULL, p_wallet, p_amount, 'deposit', 'completed', p_desc);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION deduct_wallet_funds(p_wallet BIGINT, p_amount NUMERIC, p_desc TEXT)
RETURNS VOID AS $$
DECLARE cur_balance NUMERIC;
BEGIN
    SELECT balance INTO cur_balance FROM wallets WHERE id = p_wallet FOR UPDATE;
    IF cur_balance IS NULL THEN RAISE EXCEPTION 'Wallet not found'; END IF;
    IF p_amount <= 0 THEN RAISE EXCEPTION 'Amount must be > 0'; END IF;
    IF cur_balance < p_amount THEN RAISE EXCEPTION 'Insufficient balance'; END IF;
    UPDATE wallets SET balance = balance - p_amount, updated_at = NOW() WHERE id = p_wallet;
    INSERT INTO transactions (from_wallet, to_wallet, amount, transaction_type, status, description)
    VALUES (p_wallet, NULL, p_amount, 'withdraw', 'completed', p_desc);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION transfer_wallet_funds(p_from BIGINT, p_to BIGINT, p_amount NUMERIC, p_desc TEXT)
RETURNS VOID AS $$
BEGIN
    PERFORM 1;
    IF p_from = p_to THEN RAISE EXCEPTION 'Cannot transfer to same wallet'; END IF;
    IF p_amount <= 0 THEN RAISE EXCEPTION 'Amount must be > 0'; END IF;
    PERFORM deduct_wallet_funds(p_from, p_amount, p_desc);
    PERFORM add_wallet_funds(p_to, p_amount, p_desc);
END;
$$ LANGUAGE plpgsql;

-- Create order from cart
CREATE OR REPLACE FUNCTION create_order_from_cart(p_buyer BIGINT)
RETURNS BIGINT AS $$
DECLARE v_order_id BIGINT;
BEGIN
    INSERT INTO orders (buyer_id, status) VALUES (p_buyer, 'pending') RETURNING id INTO v_order_id;
    INSERT INTO order_items (order_id, product_id, quantity, price, total_price)
    SELECT v_order_id, ci.product_id, ci.quantity, p.price, (p.price * ci.quantity)
    FROM cart_items ci JOIN carts c ON c.id = ci.cart_id AND c.buyer_id = p_buyer
    JOIN products p ON p.id = ci.product_id;
    -- totals trigger will compute total
    RETURN v_order_id;
END;
$$ LANGUAGE plpgsql;

-- Process order payment using wallet
CREATE OR REPLACE FUNCTION process_order_payment(p_order BIGINT)
RETURNS VOID AS $$
DECLARE v_buyer BIGINT; v_total NUMERIC; v_wallet BIGINT;
BEGIN
    SELECT buyer_id, total_price INTO v_buyer, v_total FROM orders WHERE id = p_order FOR UPDATE;
    IF v_buyer IS NULL THEN RAISE EXCEPTION 'Order not found'; END IF;
    SELECT id INTO v_wallet FROM wallets WHERE user_id = v_buyer FOR UPDATE;
    PERFORM deduct_wallet_funds(v_wallet, v_total, 'purchase');
    UPDATE orders SET status = 'paid', updated_at = NOW() WHERE id = p_order;
END;
$$ LANGUAGE plpgsql;

-- Reviews helpers
CREATE OR REPLACE FUNCTION get_product_review_count(p_product BIGINT)
RETURNS INTEGER AS $$
DECLARE v_cnt INTEGER; BEGIN
    SELECT COUNT(*) INTO v_cnt FROM reviews WHERE product_id = p_product; RETURN v_cnt; END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_product_rating(p_product BIGINT)
RETURNS NUMERIC AS $$
DECLARE v_avg NUMERIC; BEGIN
    SELECT COALESCE(AVG(rating),0) INTO v_avg FROM reviews WHERE product_id = p_product; RETURN v_avg; END;
$$ LANGUAGE plpgsql;

-- Search products (basic FTS)
CREATE OR REPLACE FUNCTION search_products(p_query TEXT)
RETURNS SETOF products AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM products
    WHERE to_tsvector('simple', coalesce(title_fa,'') || ' ' || coalesce(title_en,'') || ' ' || coalesce(description_fa,'') || ' ' || coalesce(description_en,''))
          @@ plainto_tsquery('simple', p_query)
      AND is_active = TRUE
    ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Stats
CREATE OR REPLACE FUNCTION get_user_stats(p_user BIGINT)
RETURNS JSONB AS $$
DECLARE v_orders INT; v_spent NUMERIC; v_reviews INT; v_products INT; v_balance NUMERIC; v_json JSONB;
BEGIN
    SELECT COUNT(*), COALESCE(SUM(total_price),0) INTO v_orders, v_spent FROM orders WHERE buyer_id = p_user;
    SELECT COUNT(*) INTO v_reviews FROM reviews WHERE user_id = p_user;
    SELECT COUNT(*) INTO v_products FROM products WHERE seller_id = p_user;
    SELECT balance INTO v_balance FROM wallets WHERE user_id = p_user;
    v_json = jsonb_build_object(
        'orders', v_orders,
        'spent', v_spent,
        'reviews', v_reviews,
        'products', v_products,
        'balance', COALESCE(v_balance,0)
    );
    RETURN v_json;
END;
$$ LANGUAGE plpgsql;

--wallet functions



-- Function to add funds to wallet
CREATE OR REPLACE FUNCTION add_wallet_funds(
    p_user_id INTEGER,
    p_amount DECIMAL(12, 2),

    p_transaction_type transaction_type DEFAULT 'deposit',
    p_description TEXT DEFAULT NULL
)

RETURNS BOOLEAN AS $$
DECLARE
    wallet_record RECORD;
    transaction_id INTEGER;
BEGIN
    -- Validate amount
    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'Amount must be positive';
    END IF;
    
    -- Get wallet
    SELECT * INTO wallet_record FROM wallets WHERE user_id = p_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Wallet not found for user %', p_user_id;
    END IF;
    
    -- Update balance
    UPDATE wallets 
    SET balance = balance + p_amount,
        updated_at = CURRENT_TIMESTAMP,
        transaction_history = transaction_history || jsonb_build_object(
            'type', 'deposit',
            'amount', p_amount,
            'description', COALESCE(p_description, 'Manual deposit'),
            'timestamp', CURRENT_TIMESTAMP,
            'balance_after', balance + p_amount
        )
    WHERE user_id = p_user_id;
    
    -- Create transaction record
    INSERT INTO transactions (to_wallet_id, amount, type, status, description)
    VALUES (wallet_record.id, p_amount, 'deposit', 'completed', p_description)
    RETURNING id INTO transaction_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;





-- Function to deduct funds from wallet
CREATE OR REPLACE FUNCTION deduct_wallet_funds(
    p_user_id INTEGER,
    p_amount DECIMAL(12,2),
    p_description TEXT DEFAULT NULL
)

RETURNS BOOLEAN AS $$
DECLARE
    wallet_record RECORD;
    transaction_id INTEGER;
BEGIN
    -- Validate amount
    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'Amount must be positive';
    END IF;
    
    -- Get wallet with lock
    SELECT * INTO wallet_record FROM wallets WHERE user_id = p_user_id FOR UPDATE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Wallet not found for user %', p_user_id;
    END IF;
    
    -- Check sufficient balance
    IF wallet_record.balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient balance. Available: %, Required: %', wallet_record.balance, p_amount;
    END IF;
    
    -- Update balance
    UPDATE wallets 
    SET balance = balance - p_amount,
        updated_at = CURRENT_TIMESTAMP,
        transaction_history = transaction_history || jsonb_build_object(
            'type', 'withdraw',
            'amount', p_amount,
            'description', COALESCE(p_description, 'Manual withdrawal'),
            'timestamp', CURRENT_TIMESTAMP,
            'balance_after', balance - p_amount
        )
    WHERE user_id = p_user_id;
    
    -- Create transaction record
    INSERT INTO transactions (from_wallet_id, amount, type, status, description)
    VALUES (wallet_record.id, p_amount, 'withdraw', 'completed', p_description)
    RETURNING id INTO transaction_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;





-- Function to transfer funds between wallets
CREATE OR REPLACE FUNCTION transfer_wallet_funds(
    p_from_user_id INTEGER,
    p_to_user_id INTEGER,
    p_amount DECIMAL(12,2),
    p_description TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    from_wallet RECORD;
    to_wallet RECORD;
    transaction_id INTEGER;
BEGIN
    -- Validate amount
    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'Amount must be positive';
    END IF;
    
    -- Validate different users
    IF p_from_user_id = p_to_user_id THEN
        RAISE EXCEPTION 'Cannot transfer to the same user';
    END IF;
    
    -- Get wallets with locks
    SELECT * INTO from_wallet FROM wallets WHERE user_id = p_from_user_id FOR UPDATE;
    SELECT * INTO to_wallet FROM wallets WHERE user_id = p_to_user_id FOR UPDATE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'One or both wallets not found';
    END IF;
    
    -- Check sufficient balance
    IF from_wallet.balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient balance. Available: %, Required: %', from_wallet.balance, p_amount;
    END IF;
    
    -- Create transaction record
    INSERT INTO transactions (from_wallet_id, to_wallet_id, amount, type, status, description)
    VALUES (from_wallet.id, to_wallet.id, p_amount, 'transfer', 'completed', p_description)
    RETURNING id INTO transaction_id;
    
    RETURN transaction_id;
END;
$$ LANGUAGE plpgsql;



--products functions


--function to increment product views
CREATE OR REPLACE FUNCTION increament_product_views(p_product_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE products
    SET views_count = views_count + 1
    WHERE id = p_product_id AND is_active = TRUE;

END;
$$ LANGUAGE plpgsql;



-- Function to get product average rating
CREATE OR REPLACE FUNCTION get_product_rating(p_product_id INTEGER)
RETURNS DECIMAL(3,2) AS $$
DECLARE
    avg_rating DECIMAL(3,2);
BEGIN
    SELECT ROUND(AVG(rating)::DECIMAL, 2) INTO avg_rating
    FROM reviews
    WHERE product_id = p_product_id;

    RETURN COALESCE(avg_rating, 0);
END;
$$ LANGUAGE plpgsql;



-- Function to get product review count
CREATE OR REPLACE FUNCTION get_product_review_count(p_product_id INTEGER)
RETURNS INTEGER AS $$
DECLARE 
    review_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO review_count
    FROM reviews
    WHERE product_id = p_product_id;

    RETURN COALESCE(review_count, 0);
END;
$$ LANGUAGE plpgsql;



-- Order Functions 


-- function to create order from cart
CREATE OR REPLACE FUNCTION create_order_from_cart(
    p_buyer_id INTEGER,
    p_payment_method payment_method DEFAULT 'wallet'
)
RETURNS INTEGER AS $$
DECLARE
    cart_record RECORD;
    order_id INTEGER;
    total_amount DECIMAL(10,2) :=0;
    item_record RECORD;
BEGIN
    --get cart
    SELECT * INTO cart_record FROM carts WHERE buyer_id = p_buyer_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cart not found for user %', p_buyer_id;
    END IF;

    -- Calculate total
    SELECT COALESCE(SUM(p.price * ci.quantity), 0) INTO total_amount   
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.cart_id = cart_record.id AND p.is_active = TRUE;
   
    IF total_amount = 0 THEN
        RAISE EXCEPTION 'Cart is empty or contains only inactive products';
    END IF;      
    
    
    -- Create order
    INSERT INTO orders (buyer_id, total_price, payment_method)
    VALUES (p_buyer_id, total_amount, p_payment_method)
    RETURNING id INTO order_id;
    
    -- Add order items
    FOR item_record IN 
        SELECT ci.product_id, ci.quantity, p.price
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.cart_id = cart_record.id AND p.is_active = TRUE
    LOOP
        INSERT INTO order_items (order_id, product_id, quantity, price, total_price)
        VALUES (order_id, item_record.product_id, item_record.quantity, item_record.price, 
                item_record.quantity * item_record.price);
    END LOOP;
    
    -- Clear cart
    DELETE FROM cart_items WHERE cart_id = cart_record.id;
    
    RETURN order_id;
END;
$$ LANGUAGE plpgsql;    





-- Function to process order payment
CREATE OR REPLACE FUNCTION process_order_payment(
    p_order_id INTEGER,
    p_payment_method payment_method
)
RETURNS BOOLEAN AS $$
DECLARE
    order_record RECORD;
    buyer_wallet RECORD;
    transaction_id INTEGER;
BEGIN
    -- Get order
    SELECT * INTO order_record FROM orders WHERE id = p_order_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order not found';
    END IF;
    
    IF order_record.status != 'pending' THEN
        RAISE EXCEPTION 'Order is not in pending status';
    END IF;
    
    -- Process payment based on method
    IF p_payment_method = 'wallet' THEN
        -- Get buyer wallet
        SELECT * INTO buyer_wallet FROM wallets WHERE user_id = order_record.buyer_id;
        
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Buyer wallet not found';
        END IF;
        
        -- Check sufficient balance
        IF buyer_wallet.balance < order_record.total_price THEN
            RAISE EXCEPTION 'Insufficient wallet balance';
        END IF;
        
        -- Deduct from wallet
        PERFORM deduct_wallet_funds(
            order_record.buyer_id, 
            order_record.total_price, 
            'Payment for order ' || order_record.order_number
        );
        
        -- Create transaction record
        INSERT INTO transactions (from_wallet_id, amount, type, status, description)
        VALUES (buyer_wallet.id, order_record.total_price, 'purchase', 'completed', 
                'Payment for order ' || order_record.order_number)
        RETURNING id INTO transaction_id;
    END IF;
    
    -- Update order status
    UPDATE orders 
    SET status = 'paid',
        payment_method = p_payment_method,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_order_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;


-- search functions

-- function to search products with filters 

CREATE OR REPLACE FUNCTION search_products(
    p_search_term TEXT DEFAULT NULL,
    p_category_id INTEGER DEFAULT NULL,
    p_min_price DECIMAL(10,2) DEFAULT NULL,
    p_max_price DECIMAL(10,2) DEFAULT NULL,
    p_file_type file_type DEFAULT NULL,
    p_language language_preference DEFAULT 'fa',
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0

)
RETURNS TABLE (
    id INTEGER,
    title VARCHAR(200),
    description TEXT,
    price DECIMAL(10,2),
    category_name VARCHAR(100),
    seller_name VARCHAR(100),
    views_count INTEGER,
    download_count INTEGER,
    average_rating DECIMAL(3,2),
    review_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE

) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        CASE WHEN p_language = 'fa' THEN p.title_fa ELSE p.title_en END as title,
        CASE WHEN p_language = 'fa' THEN p.description_fa ELSE p.description_en END as description,
        p.price,
        CASE WHEN p_language = 'fa' THEN c.name_fa ELSE c.name_en END as category_name,
        u.full_name as seller_name,
        p.views_count,
        p.download_count,
        get_product_rating(p.id) as average_rating,
        get_product_review_count(p.id) as review_count,
        p.created_at
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN users u ON p.seller_id = u.id
    WHERE p.is_active = TRUE
        AND (p_search_term IS NULL OR (
            CASE WHEN p_language = 'fa' THEN 
                to_tsvector('persian', p.title_fa || ' ' || p.description_fa) @@ plainto_tsquery('persian', p_search_term)
            ELSE 
                to_tsvector('english', p.title_en || ' ' || p.description_en) @@ plainto_tsquery('english', p_search_term)
            END
        ))
        AND (p_category_id IS NULL OR p.category_id = p_category_id)
        AND (p_min_price IS NULL OR p.price >= p_min_price)
        AND (p_max_price IS NULL OR p.price <= p_max_price)
        AND (p_file_type IS NULL OR p.file_type = p_file_type)
    ORDER BY p.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;



-- statistics functions

-- function to get user statistics
CREATE OR REPLACE FUNCTION get_user_status(p_user_id INTEGER)
RETURNS JSONB AS $$
DECLARE
    stats JSONB;
    user_record RECORD;
    wallet_record RECORD;
    product_count INTEGER;
    order_count INTEGER;
    total_spent DECIMAL(12,2);
BEGIN
    -- Get user info
    SELECT * INTO user_record FROM users WHERE id = p_user_id;

    -- Get wallet info
    SELECT * INTO wallet_record FROM wallets WHERE user_id = p_user_id;

    -- Get product count (for sellers)
    SELECT COUNT(*) INTO product_count FROM products WHERE seller_id = p_user_id;

    -- Get order count
    SELECT COUNT(*) INTO order_count FROM orders WHERE buyer_id = p_user_id;

    -- Get total spent
    SELECT COALESCE(SUM(total_price), 0) INTO total_spent 
    FROM orders WHERE buyer_id = p_user_id AND status IN ('paid', 'shipped', 'delivered');

    -- Build stats JSON
    stats := jsonb_build_object(
        'user_id', p_user_id,
        'username', user_record.username,
        'full_name', user_record.full_name,
        'role', user_record.role,
        'wallet_balance', COALESCE(wallet_record.balance, 0),
        'products_count', product_count,
        'orders_count', order_count,
        'total_spent', total_spent,
        'created_at', user_record.created_at
    );

    RETURN stats;
END;
$$ LANGUAGE plpgsql;


-- function to get system statistics
CREATE OR REPLACE FUNCTION get_system_stats()
RETURNS JSNOB AS $$
DECLARE 
    stats JSNOB;
    user_count INTEGER;
    product_count INTEGER;
    order_count INTEGER;
    total_revenue DECIMAL(12,2);
    active_users INTEGER;
BEGIN
    -- Get counts
    SELECT COUNT(*) INTO user_count FROM users WHERE is_active = TRUE;
    SELECT COUNT(*) INTO product_count FROM products WHERE is_active = TRUE;
    SELECT COUNT(*) INTO order_count FROM orders;
    SELECT COUNT(*) INTO active_users FROM users WHERE last_login > CURRENT_TIMESTAMP - INTERVAL '30 days';

    -- Get total revenue
    SELECT COALESCE(SUM(total_price), 0) INTO total_revenue 
    FROM orders WHERE status IN ('paid', 'shipped', 'delivered');

    -- Build stats JSON
    stats := jsonb_build_object(
        'total_users', user_count,
        'active_users_30d', active_users,
        'total_products', product_count,
        'total_orders', order_count,
        'total_revenue', total_revenue
    );
    RETURN stats;
END;
$$ LANGUAGE plpgsql;


-- comments on functions


COMMENT ON FUNCTION add_wallet_funds(INTEGER, DECIMAL, TEXT) IS 'Adds funds to a user wallet with transaction logging';
COMMENT ON FUNCTION deduct_wallet_funds(INTEGER, DECIMAL, TEXT) IS 'Deducts funds from a user wallet with balance validation';
COMMENT ON FUNCTION transfer_wallet_funds(INTEGER, INTEGER, DECIMAL, TEXT) IS 'Transfers funds between user wallets atomically';
COMMENT ON FUNCTION increment_product_views(INTEGER) IS 'Increments product view counter';
COMMENT ON FUNCTION get_product_rating(INTEGER) IS 'Calculates average rating for a product';
COMMENT ON FUNCTION get_product_review_count(INTEGER) IS 'Gets total review count for a product';
COMMENT ON FUNCTION create_order_from_cart(INTEGER, payment_method) IS 'Creates an order from user cart items';
COMMENT ON FUNCTION process_order_payment(INTEGER, payment_method) IS 'Processes payment for an order';
COMMENT ON FUNCTION search_products(TEXT, INTEGER, DECIMAL, DECIMAL, file_type, language_preference, INTEGER, INTEGER) IS 'Advanced product search with filters';
COMMENT ON FUNCTION get_user_stats(INTEGER) IS 'Gets comprehensive statistics for a user';
COMMENT ON FUNCTION get_system_stats() IS 'Gets system-wide statistics and metrics';

