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


