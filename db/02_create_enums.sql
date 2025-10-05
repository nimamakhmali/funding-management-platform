CREATE TYPE user_role AS ENUM (-- User roles for RBAC system
    'buyer',
    'seller',
    'admin',
    'support'
);

CREATE TYPE language_preference AS ENUM (-- Language preferences
    'fa',
    'en'
);

CREATE TYPE theme_preference AS ENUM (-- Theme preferences
    'light',
    'dark'
);

CREATE TYPE file_type AS ENUM (-- Product file types
    'pdf',
    'zip',
    'docx',
    'pptx',
    'code',
    'dataset',
    'other'
);

CREATE TYPE order_status AS ENUM (-- Order statuses
    'pending',
    'paid',
    'shipped',
    'delivered',
    'cancelled',
    'refunded'
);

CREATE TYPE payment_status AS ENUM (-- Payment statuses
    'wallet',
    'gateway'
);

CREATE TYPE transaction_status AS ENUM (-- Transaction statuses
    'pending',
    'completed',
    'failed'
);

CREATE TYPE ticket_status AS ENUM (-- Ticket statuses
    'open',
    'in_progress',
    'resolved',
    'closed'
);

COMMENT ON TYPE user_role IS 'User roles for Role_Based Access Control (RBAC) system';
COMMENT ON TYPE language_preference IS 'Language preferences for user interface(english/persian)';
COMMENT ON TYPE theme_preference IS 'Theme preferences for user interface';
COMMENT ON TYPE file_type IS 'File types for product listings';
COMMENT ON TYPE order_status IS 'Order statuses for purchase workflow';
COMMENT ON TYPE payment_status IS 'Payment statuses for transaction processing';
COMMENT ON TYPE transaction_status IS 'Transaction statuses for payment processing';
COMMENT ON TYPE ticket_status IS 'Ticket statuses for support requests';