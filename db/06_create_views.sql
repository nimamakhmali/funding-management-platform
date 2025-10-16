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

