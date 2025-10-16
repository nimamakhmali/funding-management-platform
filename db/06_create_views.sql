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




