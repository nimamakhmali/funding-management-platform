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
