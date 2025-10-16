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


