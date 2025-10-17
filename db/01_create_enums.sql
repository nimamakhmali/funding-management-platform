-- ENUM types for Sci Market (PostgreSQL)
-- Safe-guard: create type only if not exists

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin','support','seller','buyer');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'language_preference') THEN
        CREATE TYPE language_preference AS ENUM ('fa','en');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'theme_preference') THEN
        CREATE TYPE theme_preference AS ENUM ('light','dark');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'file_type') THEN
        CREATE TYPE file_type AS ENUM ('pdf','zip','code','dataset','other');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE order_status AS ENUM ('pending','paid','shipped','delivered','cancelled','refunded');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
        CREATE TYPE payment_method AS ENUM ('wallet','gateway');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
        CREATE TYPE transaction_type AS ENUM ('deposit','withdraw','transfer','purchase','refund');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_status') THEN
        CREATE TYPE transaction_status AS ENUM ('pending','completed','failed');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status') THEN
        CREATE TYPE ticket_status AS ENUM ('open','in_progress','closed');
    END IF;
END $$;

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

CREATE TYPE transaction_type AS ENUM (
    'deposit', 
    'withdrawal', 
    'purchase', 
    'sale', 
    'transfer'
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


COMMENT ON TYPE user_role IS 'User roles for Role-Based Access Control (RBAC) system';
COMMENT ON TYPE language_preference IS 'Language preferences for user interface (English/Persian)';
COMMENT ON TYPE theme_preference IS 'Theme preferences for user interface';
COMMENT ON TYPE file_type IS 'File types for product listings';
COMMENT ON TYPE order_status IS 'Order statuses for purchase workflow';
COMMENT ON TYPE payment_method IS 'Available payment methods for orders (wallet/gateway)';
COMMENT ON TYPE transaction_type IS 'Types of financial transactions recorded in the wallet system';
COMMENT ON TYPE transaction_status IS 'Transaction statuses for payment processing';
COMMENT ON TYPE ticket_status IS 'Ticket statuses for support requests';

