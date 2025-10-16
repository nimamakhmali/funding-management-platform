-- seed data 


-- CATEGORIES SEED DATA

-- Root categories
INSERT INTO categories (name_fa, name_en, slug, description, is_active, order_index) VALUES
('علوم کامپیوتر', 'Computer Science', 'computer-science', 'محصولات مرتبط با علوم کامپیوتر و برنامه‌نویسی', TRUE, 1),
('مهندسی', 'Engineering', 'engineering', 'محصولات مهندسی و فنی', TRUE, 2),
('علوم پایه', 'Basic Sciences', 'basic-sciences', 'ریاضیات، فیزیک، شیمی و علوم پایه', TRUE, 3),
('علوم انسانی', 'Humanities', 'humanities', 'ادبیات، تاریخ، فلسفه و علوم انسانی', TRUE, 4),
('پزشکی و سلامت', 'Medicine & Health', 'medicine-health', 'محصولات پزشکی و سلامت', TRUE, 5),
('کسب و کار', 'Business', 'business', 'مدیریت، اقتصاد و کسب و کار', TRUE, 6);


-- Computer Science subcategories
INSERT INTO categories (name_fa, name_en, slug, description, parent_id, is_active, order_index) VALUES
('برنامه‌نویسی', 'Programming', 'programming', 'کدها و کتابخانه‌های برنامه‌نویسی', 1, TRUE, 1),
('هوش مصنوعی', 'Artificial Intelligence', 'artificial-intelligence', 'الگوریتم‌های هوش مصنوعی و یادگیری ماشین', 1, TRUE, 2),
('پایگاه داده', 'Database', 'database', 'طراحی و مدیریت پایگاه داده', 1, TRUE, 3),
('امنیت سایبری', 'Cybersecurity', 'cybersecurity', 'امنیت اطلاعات و شبکه', 1, TRUE, 4),
('توسعه وب', 'Web Development', 'web-development', 'فریمورک‌ها و ابزارهای توسعه وب', 1, TRUE, 5);


-- Engineering subcategories
INSERT INTO categories (name_fa, name_en, slug, description, parent_id, is_active, order_index) VALUES
('مهندسی نرم‌افزار', 'Software Engineering', 'software-engineering', 'مهندسی نرم‌افزار و معماری سیستم', 2, TRUE, 1),
('مهندسی برق', 'Electrical Engineering', 'electrical-engineering', 'الکترونیک و برق', 2, TRUE, 2),
('مهندسی مکانیک', 'Mechanical Engineering', 'mechanical-engineering', 'مکانیک و طراحی', 2, TRUE, 3),
('مهندسی عمران', 'Civil Engineering', 'civil-engineering', 'ساخت و ساز و عمران', 2, TRUE, 4);


-- Basic Sciences subcategories
INSERT INTO categories (name_fa, name_en, slug, description, parent_id, is_active, order_index) VALUES
('ریاضیات', 'Mathematics', 'mathematics', 'ریاضیات و آمار', 3, TRUE, 1),
('فیزیک', 'Physics', 'physics', 'فیزیک و مکانیک کوانتومی', 3, TRUE, 2),
('شیمی', 'Chemistry', 'chemistry', 'شیمی و مواد', 3, TRUE, 3),
('زیست‌شناسی', 'Biology', 'biology', 'زیست‌شناسی و ژنتیک', 3, TRUE, 4);


-- users seed data


-- Admin user
INSERT INTO users (username, password_hash, email, full_name, role, is_active, is_staff, is_superuser) VALUES
('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', 'admin@sci-market.ir', 'مدیر سیستم', 'admin', TRUE, TRUE, TRUE);

-- Support user
INSERT INTO users (username, password_hash, email, full_name, role, is_active, is_staff) VALUES
('support', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', 'support@sci-market.ir', 'پشتیبانی', 'support', TRUE, TRUE);

-- Sample sellers
INSERT INTO users (username, password_hash, email, full_name, role, is_active) VALUES
('seller1', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', 'seller1@sci-market.ir', 'علی احمدی', 'seller', TRUE),
('seller2', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', 'seller2@sci-market.ir', 'فاطمه محمدی', 'seller', TRUE),
('seller3', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', 'seller3@sci-market.ir', 'حسن رضایی', 'seller', TRUE);

-- Sample buyers
INSERT INTO users (username, password_hash, email, full_name, role, is_active) VALUES
('buyer1', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', 'buyer1@sci-market.ir', 'مریم کریمی', 'buyer', TRUE),
('buyer2', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', 'buyer2@sci-market.ir', 'محمد حسینی', 'buyer', TRUE),
('buyer3', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', 'buyer3@sci-market.ir', 'زهرا نوری', 'buyer', TRUE);



-- PRODUCTS SEED DATA


-- Programming products
INSERT INTO products (seller_id, title_fa, title_en, slug, description_fa, description_en, category_id, price, file_type, tags, is_active, is_featured) VALUES
(3, 'کتابخانه پردازش تصویر Python', 'Python Image Processing Library', 'python-image-processing', 'کتابخانه کامل برای پردازش تصویر با Python شامل الگوریتم‌های پیشرفته', 'Complete Python library for image processing with advanced algorithms', 7, 150000, 'code', '["python", "image-processing", "opencv", "computer-vision"]', TRUE, TRUE),
(3, 'الگوریتم‌های مرتب‌سازی پیشرفته', 'Advanced Sorting Algorithms', 'advanced-sorting-algorithms', 'مجموعه کامل الگوریتم‌های مرتب‌سازی با پیاده‌سازی در C++', 'Complete collection of sorting algorithms implemented in C++', 7, 200000, 'code', '["algorithms", "sorting", "c++", "data-structures"]', TRUE, FALSE),
(4, 'فریمورک توسعه وب React', 'React Web Development Framework', 'react-web-framework', 'فریمورک کامل برای توسعه اپلیکیشن‌های وب با React و TypeScript', 'Complete framework for web application development with React and TypeScript', 11, 300000, 'code', '["react", "typescript", "web-development", "frontend"]', TRUE, TRUE);

-- AI/ML products
INSERT INTO products (seller_id, title_fa, title_en, slug, description_fa, description_en, category_id, price, file_type, tags, is_active, is_featured) VALUES
(4, 'مدل تشخیص چهره با TensorFlow', 'Face Recognition Model with TensorFlow', 'face-recognition-tensorflow', 'مدل کامل تشخیص چهره با دقت بالا استفاده از TensorFlow', 'Complete face recognition model with high accuracy using TensorFlow', 8, 500000, 'code', '["tensorflow", "face-recognition", "machine-learning", "computer-vision"]', TRUE, TRUE),
(5, 'دیتاست تصاویر پزشکی', 'Medical Images Dataset', 'medical-images-dataset', 'دیتاست بزرگ تصاویر پزشکی برای آموزش مدل‌های تشخیصی', 'Large dataset of medical images for training diagnostic models', 8, 750000, 'dataset', '["medical", "dataset", "images", "diagnosis"]', TRUE, FALSE);

-- Database products
INSERT INTO products (seller_id, title_fa, title_en, slug, description_fa, description_en, category_id, price, file_type, tags, is_active, is_featured) VALUES
(5, 'طراحی پایگاه داده PostgreSQL', 'PostgreSQL Database Design', 'postgresql-database-design', 'راهنمای کامل طراحی و بهینه‌سازی پایگاه داده PostgreSQL', 'Complete guide for PostgreSQL database design and optimization', 9, 250000, 'pdf', '["postgresql", "database", "design", "optimization"]', TRUE, FALSE);

-- Mathematics products
INSERT INTO products (seller_id, title_fa, title_en, slug, description_fa, description_en, category_id, price, file_type, tags, is_active, is_featured) VALUES
(3, 'محاسبات عددی پیشرفته', 'Advanced Numerical Computing', 'advanced-numerical-computing', 'کتاب کامل محاسبات عددی با مثال‌های عملی', 'Complete book on numerical computing with practical examples', 13, 180000, 'pdf', '["mathematics", "numerical", "computing", "algorithms"]', TRUE, TRUE);








-- REVIEWS SEED DATA


-- Reviews for products
INSERT INTO reviews (product_id, user_id, rating, comment, is_verified_purchase) VALUES
(1, 6, 5, 'کتابخانه عالی و کامل. تمام نیازهای پردازش تصویر را پوشش می‌دهد.', TRUE),
(1, 7, 4, 'کیفیت کد خوب است اما مستندات کمی کم است.', TRUE),
(2, 6, 5, 'الگوریتم‌ها به خوبی پیاده‌سازی شده‌اند.', FALSE),
(3, 7, 5, 'فریمورک بسیار کاربردی و به‌روز.', TRUE),
(4, 8, 4, 'مدل دقت خوبی دارد اما نیاز به بهینه‌سازی دارد.', TRUE),
(5, 6, 5, 'دیتاست بسیار کامل و باکیفیت.', TRUE);


-- WISHLISTS SEED DATA


-- Add some products to wishlists
INSERT INTO wishlists (user_id, product_id) VALUES
(6, 2),
(6, 4),
(7, 1),
(7, 3),
(8, 5);


-- ORDERS SEED DATA


-- Sample orders
INSERT INTO orders (buyer_id, order_number, total_price, status, payment_method) VALUES
(6, 'ORD-12345678', 150000, 'delivered', 'wallet'),
(7, 'ORD-87654321', 300000, 'paid', 'wallet'),
(8, 'ORD-11223344', 500000, 'shipped', 'gateway');

-- Order items
INSERT INTO order_items (order_id, product_id, quantity, price, total_price) VALUES
(1, 1, 1, 150000, 150000),
(2, 3, 1, 300000, 300000),
(3, 4, 1, 500000, 500000);


-- TICKETS SEED DATA


-- Sample support tickets
INSERT INTO tickets (user_id, subject, message, status, assigned_to) VALUES
(6, 'مشکل در دانلود محصول', 'نمی‌توانم محصول خریداری شده را دانلود کنم. لطفاً راهنمایی کنید.', 'open', 2),
(7, 'سوال در مورد کیف پول', 'چگونه می‌توانم کیف پول خود را شارژ کنم؟', 'closed', 2),
(8, 'پیشنهاد بهبود', 'پیشنهاد می‌کنم قابلیت جستجوی پیشرفته اضافه شود.', 'in_progress', 2);

-- Ticket responses
INSERT INTO ticket_responses (ticket_id, user_id, message) VALUES
(1, 2, 'لطفاً شماره سفارش خود را ارسال کنید تا مشکل را بررسی کنم.'),
(2, 2, 'برای شارژ کیف پول، به بخش کیف پول در پنل کاربری مراجعه کنید.'),
(3, 2, 'پیشنهاد شما ثبت شد و در نسخه بعدی اضافه خواهد شد.');


-- AUDIT LOGS SEED DATA


-- Sample audit logs
INSERT INTO audit_logs (user_id, action, ip_address, details) VALUES
(1, 'login', '192.168.1.100', '{"login_method": "email", "user_agent": "Mozilla/5.0"}'),
(3, 'create_product', '192.168.1.101', '{"product_id": 1, "title": "کتابخانه پردازش تصویر Python"}'),
(6, 'purchase', '192.168.1.102', '{"order_id": 1, "total_price": 150000}'),
(7, 'create_review', '192.168.1.103', '{"product_id": 1, "rating": 5}');


-- COMMENTS ON SEED DATA


COMMENT ON TABLE categories IS 'Sample categories for scientific products';
COMMENT ON TABLE users IS 'Sample users including admin, support, sellers, and buyers';
COMMENT ON TABLE products IS 'Sample products across different scientific categories';
COMMENT ON TABLE reviews IS 'Sample product reviews and ratings';
COMMENT ON TABLE wishlists IS 'Sample user wishlists';
COMMENT ON TABLE orders IS 'Sample orders with different statuses';
COMMENT ON TABLE tickets IS 'Sample support tickets';
COMMENT ON TABLE audit_logs IS 'Sample audit log entries';


-- NOTES


-- Password hash for all users: 'password123' (for development only)
-- In production, use proper password hashing with bcrypt
-- All prices are in Iranian Rial (IRR)
-- Sample data is for development and testing purposes only

