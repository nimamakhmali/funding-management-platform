-- Views for reporting and convenience

CREATE OR REPLACE VIEW product_details AS
SELECT p.*, 
       c.name_fa AS category_name_fa,
       c.name_en AS category_name_en,
       u.full_name AS seller_name,
       get_product_rating(p.id) AS average_rating,
       get_product_review_count(p.id) AS reviews_count
FROM products p
LEFT JOIN categories c ON c.id = p.category_id
JOIN users u ON u.id = p.seller_id;

CREATE OR REPLACE VIEW featured_products AS
SELECT * FROM products WHERE is_featured = TRUE AND is_active = TRUE
ORDER BY created_at DESC;

CREATE OR REPLACE VIEW category_stats AS
SELECT c.id, c.name_fa, c.name_en,
       COUNT(p.id) AS products_count,
       SUM(p.views_count) AS total_views
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
GROUP BY c.id, c.name_fa, c.name_en;

CREATE OR REPLACE VIEW user_profiles AS
SELECT u.id, u.username, u.email, u.full_name, u.role, u.created_at,
       (SELECT COUNT(*) FROM orders o WHERE o.buyer_id = u.id) AS total_orders,
       (SELECT COUNT(*) FROM products p WHERE p.seller_id = u.id) AS total_products,
       (SELECT balance FROM wallets w WHERE w.user_id = u.id) AS wallet_balance
FROM users u;

CREATE OR REPLACE VIEW order_details AS
SELECT o.*, u.full_name AS buyer_name,
       (SELECT jsonb_agg(jsonb_build_object(
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'total_price', oi.total_price
        )) FROM order_items oi WHERE oi.order_id = o.id) AS items
FROM orders o JOIN users u ON u.id = o.buyer_id;

CREATE OR REPLACE VIEW transaction_history AS
SELECT t.*, fw.user_id AS from_user_id, tw.user_id AS to_user_id
FROM transactions t
LEFT JOIN wallets fw ON fw.id = t.from_wallet
LEFT JOIN wallets tw ON tw.id = t.to_wallet;

-- This file creates database views for complex queries

-- PRODUCT VIEWS

-- View for product details with statistics
CREATE OR REPLACE VIEW product_details AS
SELECT
    p.id,
    p.title_fa,,
    p.title_en,
    p.slug,
    p.description_fa,
    p.description_en,
    p.price,
    p.file_path,
    p.file_type,
    p.tags,
    p.views_count,
    p.download_count,
    p.is_active,
    p.is_featured,
    p.created_at,
    p.updated_at,
    -- category information
    c.name_fa as category_name_fa,
    c.name_en as category_name_en,
    c.slug as category_slug,
    -- seller information
    u.username as seller_username,
    u.full_name as seller_name,
    u.role as seller_role,
    -- statistics
    COALESCE(AVG(r.rating), 0) as average_rating,
    COUNT(r.id) as review_count,
    COUNT(pf.id) as file_count

FROM products p 
LEFT JOIN categories c     ON p.category_id = c.id
LEFT JOIN users u          ON p.seller_id = u.id
LEFT JOIN reviews r        ON p.id = pf.product_id
LEFT JOIN product_files pf ON p.id = pf.product_id
WHERE p.is_active = TRUE
GROUP BY p.id, c.id, u.id;

-- view for featured products
CREATE OR REPLACE VIEW featured_products AS
SELECT  
    pd.*,
    ROM_NUMBER() OVER (ORDER BY pd.views_count DESC, pd.download_count DESC) as popularity_rank
FROM product_details pd
WHERE pd.is_featured = TRUE
ORDER BY pd.created_at DESC;



-- view for product categories with product counts
CREATE OR REPLACE VIEW category_stats AS
SELECT
    c.id,
    c.name_fa,
    c.name_en,
    c.slug,
    c.description,
    c.parent_id,
    c.is_active,
    c.order_index,
    c.created_at,

    -- statistics
    COUNT(p.id) as product_count,
    COALESCE(AVG(p.price), 0) as average_price,
    COALESCE(SUM(p.views_count), 0) as total_views,
    COALESCE(SUM(p.download_count), 0) as total_downloads,

    -- parent category name
    pc.name_fa as parent_name_fa,
    pc.name_en as parent_name_en

FROM categories C
LEFT JOIN products p ON c.id = p.category_id AND p.is_active = TRUE
LEFT JOIN categories pc ON c.parent_id = pc.id
GROUP BY c.id, pc.id
ORDER BY c.order_index, c.name_fa;


-- user views


-- view for user profiles with statistics
CREATE OR REPLACE VIEW user_profiles AS 
SELECT
    u.id,
    u.username,
    u.email,
    u.full_name,
    u.role,
    u.language_preference,
    u.theme_preference,
    u.is_active,
    u.created_at,
    u.last_login,

    -- wallet information 
    w.balance as wallet_balance,

    --statistics
    COUNT(DISTINCT p..id) as products_sold,
    COUNT(DISTINCT o.id)  as order_made,
    COALESCE(SUM(CASE WHEN o.status IN ('paid', 'shipped', 'delivered') THEN o.total_price ELSE 0 END), 0) as total_spent,
    COALESCE(SUM(CASE WHEN p.seller_id = u.id THEN p.download_count ELSE 0 END), 0) as total_downloads,


    -- rating as seller 
    COALESCE(AVG(seller_reviews.rating), 0) as seller_rating,
    COUNT(seller_reviews.id) as seller_review_count

FROM users u
LEFT JOIN wallets  w ON u.id = w.user_id
LEFT JOIN products p ON u.id = p.seller_id AND p.is_active = TRUE
LEFT JOIN orders   o ON u.id = o.buyer_id
LEFT JOIN reviews seller_reviews ON p.id = seller_reviews.product_id
GROUP BY u.id, w.id;

-- View for active sellers
CREATE OR REPLACE VIEW active_sellers AS
SELECT 
    up.*,
    ROW_NUMBER() OVER (ORDER BY up.seller_rating DESC, up.products_sold DESC) as seller_rank
FROM user_profiles up
WHERE up.role IN ('seller', 'admin') 
    AND up.is_active = TRUE
    AND up.products_sold > 0
ORDER BY up.seller_rating DESC, up.products_sold DESC;


-- order views 

-- view for order details with items
CREATE OR REPLACE VIEW order_details AS
SELECT 
    o.id,
    o.order_number,
    o.buyer_id,
    o.total_price,
    o.status,
    o.payment_method,
    o.tracking_code,
    o.notes,
    o.created_at,
    o.updated_at,

    -- buyer information
    u.username as buyer_username,
    u.full_name as buyer_name,
    u.email as buyer_email,

    -- order items summary
    COUNT(oi.id) as item_count,
    STRING_AGG(p.title_fa, ', ') as product_titles,

    -- payment status
    CASE 
        WHEN o.status = 'pending' THEN 'Awaiting Payment'
        WHEN o.status = 'paid' THEN 'Payment Confirmed'
        WHEN o.status = 'shipped' THEN 'Shipped'
        WHEN o.status = 'delivered' THEN 'Delivered'
        WHEN o.status = 'cancelled' THEN 'Cancelled'
        WHEN o.status = 'refunded' THEN 'Refunded'
        ELSE 'Unknown'
    END as status_description

    
FROM orders o
LEFT JOIN users u ON o.buyer_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id
GROUP BY o.id, u.id;

-- View for order items with product details
CREATE OR REPLACE VIEW order_items_details AS
SELECT 
    oi.id,
    oi.order_id,
    oi.product_id,
    oi.quantity,
    oi.price,
    oi.total_price,
    
    -- Order information
    o.order_number,
    o.status as order_status,
    o.created_at as order_date,
    
    -- Product information
    p.title_fa,
    p.title_en,
    p.slug as product_slug,
    p.file_type,
    
    -- Seller information
    seller.username as seller_username,
    seller.full_name as seller_name,
    
    -- Buyer information
    buyer.username as buyer_username,
    buyer.full_name as buyer_name
    
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
JOIN products p ON oi.product_id = p.id
JOIN users seller ON p.seller_id = seller.id
JOIN users buyer ON o.buyer_id = buyer.id;


-- transaction views

-- view for transaction history with user details
CREATE OR REPLACE VIEW transaction_history AS 
SELECT
    t.id,
    t.amount,
    t.type,
    t.status,
    t.description,
    t.reference_id,
    r.created_at,

    --form wallet information
    from_user.username as from_username,
    from_user.full_name as from_name,

    -- to wallet information 
    to_user.username as to_username,
    to_user.full_name as to_name,

    -- transaction type description
    CASE t.type
        WHEN 'deposit'  THEN 'Wallet Deposit'
        WHEN 'withdraw' THEN 'Wallet Withdrawal'
        WHEN 'transfer' THEN 'Wallet Transfer'
        WHEN 'purchase' THEN 'Product Purchase'
        WHEN 'refund'   THEN 'Order Refund'
        ELSE 'Unknown'
    END as type_description,

    -- status description
    CASE t.status
        WHEN 'pending'   THEN 'Processing'
        WHEN 'completed' THEN 'Completed'
        WHEN 'failed'    THEN 'Failed'

        ELSE as status_description

FROM transactions t
LEFT JOIN wallets from_wallet ON t.from_wallet_id = from_wallet.id
LEFT JOIN users from_user ON from_wallet.user_id = from_user.id
LEFT JOIN wallets to_wallet ON t.to_wallet_id = to_wallet.id
LEFT JOIN users to_user ON to_wallet.user_id = to_user.id
ORDER BY t.created_at DESC;
          

-- review views

-- View for product reviews with user details
CREATE OR REPLACE VIEW product_reviews AS
SELECT 
    r.id,
    r.product_id,
    r.user_id,
    r.rating,
    r.comment,
    r.is_verified_purchase,
    r.created_at,
    r.updated_at,
    
    -- Product information
    p.title_fa as product_title,
    p.slug as product_slug,
    
    -- User information
    u.username,
    u.full_name as reviewer_name,
    
    -- Seller information
    seller.username as seller_username,
    seller.full_name as seller_name
    
FROM reviews r
JOIN products p ON r.product_id = p.id
JOIN users u ON r.user_id = u.id
JOIN users seller ON p.seller_id = seller.id
ORDER BY r.created_at DESC;


-- Ticket Views

CREATE OR REPLACE VIEW ticket_details AS 
SELECT
    t.id,
    t.subject,
    t.message,
    t.status,
    t.created_at,
    t.updated_at,

    -- User Info
    u.username  as user_username,
    u.full_name as user_name,
    u.email     as user_email,

    -- Assigned support Info
    support.username as assigned_username,
    support.full_name as assigned_name,

    --Response count
    COUNT(tr.id) as response_count,
    MAX(tr.created_at) as last_response_at,

    --status description
    CASE t.status
        WHEN 'open' THEN 'Open'
        WHEN 'in_progress' THEN 'In Progress'
        WHEN 'closed'      THEN 'Closed'
        ELSE 'Unknown'
    END as status_description  

FROM tickets t
JOIN users u ON t.user_id = u.id
LEFT JOIN users support ON t.assigned_to = support.id
LEFT JOIN ticket_responses tr ON t.id = tr.ticket_id
GROUP BY t.id, u.id, support.id
ORDER BY t.created_at DESC;



-- Analytics Views

-- view for daily sales statistics
CREATE OR REPLACE VIEW daily_sales_stats AS 
SELECT
    DATE(created_at) as sale_date,
    COUNT(*) as order_count,
    SUM(total_price) as total_revenue,
    AVG(total_price) as average_order_value,
    COUNT(DISTINCT buyer_id) as unique_buyers
FROM orders
WHERE status IN ('paid', 'shipped', 'delivered')    
GROUP BY DATE(created_at)
ORDER BY sale_date DESC;


--view for product performance
CREATE OR REPLACE VIEW product_performance AS 
SELECT
    p.id,
    p.title_fa,
    p.price,
    p.views_count,
    p.download_count,
    p.created_at,

    -- sales statistics
    COUNT(oi.id) as times_sold,
    COALESCE(SUM(oi.quantity), 0) as total_quantity_sold,
    COALESCE(SUM(oi.total_price), 0) as total_revenue,

    -- rating statistics
    COALESCE(AVG(r.rating), 0) as average_rating,
    COUNT(r.id) as review_count,

    
    -- Performance metrics
    CASE 
        WHEN p.views_count > 0 THEN ROUND((p.download_count::DECIMAL / p.views_count) * 100, 2)
        ELSE 0
    END as conversion_rate,
    
    -- Seller information
    u.username as seller_username,
    u.full_name as seller_name
    
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN reviews r ON p.id = r.product_id
LEFT JOIN users u ON p.seller_id = u.id
WHERE p.is_active = TRUE
GROUP BY p.id, u.id
ORDER BY total_revenue DESC, p.views_count DESC;


-- comments on views


COMMENT ON VIEW product_details IS 'Comprehensive product information with statistics';
COMMENT ON VIEW featured_products IS 'Featured products with popularity ranking';
COMMENT ON VIEW category_stats IS 'Category information with product statistics';
COMMENT ON VIEW user_profiles IS 'User profiles with comprehensive statistics';
COMMENT ON VIEW active_sellers IS 'Active sellers ranked by performance';
COMMENT ON VIEW order_details IS 'Order information with buyer and item details';
COMMENT ON VIEW order_items_details IS 'Detailed order items with product and user information';
COMMENT ON VIEW transaction_history IS 'Transaction history with user details';
COMMENT ON VIEW product_reviews IS 'Product reviews with user and product information';
COMMENT ON VIEW ticket_details IS 'Support tickets with user and response information';
COMMENT ON VIEW daily_sales_stats IS 'Daily sales statistics and metrics';
COMMENT ON VIEW product_performance IS 'Product performance metrics and analytics';
