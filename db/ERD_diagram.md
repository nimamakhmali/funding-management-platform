# ERD Diagram - Sci Market System

## Entity Relationship Diagram

```mermaid
erDiagram
    %% Core User Management
    users {
        int id PK
        varchar username
        varchar email UK
        varchar phone
        varchar full_name
        varchar profile_picture
        varchar role
        varchar language_preference
        varchar theme_preference
        boolean is_active
        boolean is_staff
        boolean is_superuser
        datetime created_at
        datetime updated_at
        datetime last_login
    }

    user_roles {
        int id PK
        int user_id FK
        varchar role
        datetime assigned_at
        int assigned_by FK
    }

    %% Wallet System
    wallets {
        int id PK
        int user_id FK
        decimal balance
        jsonb transaction_history
        datetime created_at
        datetime updated_at
    }

    transactions {
        int id PK
        int from_wallet_id FK
        int to_wallet_id FK
        decimal amount
        varchar type
        varchar status
        text description
        varchar reference_id
        datetime created_at
    }

    %% Category System
    categories {
        int id PK
        varchar name_fa
        varchar name_en
        varchar slug UK
        text description
        int parent_id FK
        boolean is_active
        int order_index
        int level
        datetime created_at
        datetime updated_at
    }

    %% Product System
    products {
        int id PK
        int seller_id FK
        varchar title_fa
        varchar title_en
        varchar slug UK
        text description_fa
        text description_en
        int category_id FK
        decimal price
        varchar file_path
        varchar file_type
        jsonb tags
        int views_count
        int download_count
        varchar preview_image
        boolean is_active
        boolean is_featured
        datetime created_at
        datetime updated_at
    }

    product_files {
        int id PK
        int product_id FK
        varchar file_path
        varchar file_name
        int file_size
        datetime upload_date
    }

    %% Shopping Cart System
    carts {
        int id PK
        int buyer_id FK
        datetime created_at
        datetime updated_at
    }

    cart_items {
        int id PK
        int cart_id FK
        int product_id FK
        int quantity
        decimal total_price
        datetime added_at
    }

    %% Order System
    orders {
        int id PK
        int buyer_id FK
        varchar order_number UK
        decimal total_price
        varchar status
        varchar payment_method
        varchar tracking_code
        text notes
        datetime created_at
        datetime updated_at
    }

    order_items {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal price
        decimal total_price
    }

    %% Support System
    tickets {
        int id PK
        int user_id FK
        varchar subject
        text message
        varchar status
        int assigned_to FK
        datetime created_at
        datetime updated_at
    }

    ticket_responses {
        int id PK
        int ticket_id FK
        int user_id FK
        text message
        datetime created_at
    }

    %% Review System
    reviews {
        int id PK
        int user_id FK
        int product_id FK
        int rating
        text comment
        boolean is_verified_purchase
        datetime created_at
        datetime updated_at
    }

    %% Wishlist System
    wishlists {
        int id PK
        int user_id FK
        int product_id FK
        datetime added_at
    }

    %% Audit System
    audit_logs {
        int id PK
        int user_id FK
        varchar action
        varchar ip_address
        jsonb details
        datetime created_at
    }

    %% Relationships
    users ||--o{ user_roles : "has"
    users ||--o{ user_roles : "assigned_by"
    users ||--|| wallets : "owns"
    users ||--o{ products : "sells"
    users ||--o{ carts : "has"
    users ||--o{ orders : "places"
    users ||--o{ tickets : "creates"
    users ||--o{ ticket_responses : "writes"
    users ||--o{ reviews : "writes"
    users ||--o{ wishlists : "has"
    users ||--o{ audit_logs : "performs"

    wallets ||--o{ transactions : "from"
    wallets ||--o{ transactions : "to"

    categories ||--o{ categories : "parent"
    categories ||--o{ products : "contains"

    products ||--o{ product_files : "has"
    products ||--o{ cart_items : "in"
    products ||--o{ order_items : "in"
    products ||--o{ reviews : "receives"
    products ||--o{ wishlists : "in"

    carts ||--o{ cart_items : "contains"

    orders ||--o{ order_items : "contains"

    tickets ||--o{ ticket_responses : "has"
    tickets ||--o{ tickets : "assigned_to"
```

## Key Relationships

### 1. User Management
- **users** → **user_roles**: One-to-many (RBAC system)
- **users** → **wallets**: One-to-one (each user has one wallet)

### 2. Financial System
- **wallets** → **transactions**: One-to-many (from/to relationships)
- **transactions** can be between different wallets

### 3. Product Catalog
- **categories** → **categories**: Self-referencing (hierarchical categories)
- **categories** → **products**: One-to-many
- **products** → **product_files**: One-to-many (additional files)

### 4. Shopping System
- **users** → **carts**: One-to-one
- **carts** → **cart_items**: One-to-many
- **cart_items** → **products**: Many-to-one

### 5. Order Management
- **users** → **orders**: One-to-many
- **orders** → **order_items**: One-to-many
- **order_items** → **products**: Many-to-one

### 6. Support System
- **users** → **tickets**: One-to-many
- **tickets** → **ticket_responses**: One-to-many
- **tickets** → **users**: Many-to-one (assigned_to)

### 7. Review System
- **users** → **reviews**: One-to-many
- **products** → **reviews**: One-to-many
- **reviews** have unique constraint on (user_id, product_id)

### 8. Wishlist System
- **users** → **wishlists**: One-to-many
- **products** → **wishlists**: One-to-many
- **wishlists** have unique constraint on (user_id, product_id)

### 9. Audit System
- **users** → **audit_logs**: One-to-many
- **audit_logs** track all user actions

## Database Constraints

### Primary Keys
- All tables have `id` as primary key
- Auto-incrementing integers

### Foreign Keys
- All foreign keys have proper referential integrity
- `ON DELETE CASCADE` for dependent records
- `ON DELETE SET NULL` for optional references

### Unique Constraints
- `users.email` - unique email addresses
- `categories.slug` - unique category slugs
- `products.slug` - unique product slugs
- `orders.order_number` - unique order numbers
- `wishlists(user_id, product_id)` - unique wishlist entries
- `reviews(user_id, product_id)` - unique review per user per product

### Check Constraints
- `price >= 0` for products and order items
- `quantity > 0` for cart items and order items
- `file_size > 0` for product files
- `balance >= 0` for wallets
- `amount > 0` for transactions
- `rating BETWEEN 1 AND 5` for reviews

## Indexes

### Performance Indexes
- Foreign key indexes on all FK columns
- Unique indexes on slug fields
- Composite indexes on frequently queried combinations
- GIN indexes on JSONB fields (tags, transaction_history)
- Full-text search indexes on product titles and descriptions

### Audit Indexes
- Time-based indexes on created_at fields
- Action-based indexes on audit_logs.action
- User-based indexes on user_id fields

## MongoDB Collections (NoSQL)

### Event Logs
- High-volume application events
- TTL: 90 days
- Indexes: action, userId, createdAt

### Search Analytics
- User search queries and results
- Indexes: query, userId, timestamp

### Download Audit
- Product download tracking
- Indexes: productId, userId, timestamp

### Ticket Messages (Optional)
- Large ticket conversations
- Indexes: ticketId, userId, timestamp

## Summary

This ERD represents a complete e-commerce marketplace system with:
- **16 PostgreSQL tables** with proper relationships
- **RBAC system** for user management
- **Financial system** with wallets and transactions
- **Product catalog** with hierarchical categories
- **Shopping cart** and order management
- **Support system** with tickets and responses
- **Review system** with ratings and comments
- **Wishlist system** for user favorites
- **Audit logging** for all actions
- **MongoDB collections** for analytics and logs

The system is designed for scalability, performance, and data integrity with proper constraints, indexes, and relationships.
