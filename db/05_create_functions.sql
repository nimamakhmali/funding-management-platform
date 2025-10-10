--wallet functions

-- Function to add funds to wallet
CREATE OR REPLACE FUNCTION add_wallet_funds(
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
