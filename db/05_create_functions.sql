--wallet functions


-- Function to add funds to wallet
CREATE OR REPLACE FUNCTION add_wallet_funds(
    p_user_id INTEGER,
    p_amount DECIMAL(12, 2),
    
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



--products


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
