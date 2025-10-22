# Relationship Matrix - Sci Market (PostgreSQL)

| From            | Relationship | To               | Cardinality | Optionality | Notes |
|-----------------|--------------|------------------|-------------|-------------|-------|
| User            | owns         | Wallet           | 1:1         | Mandatory   | One wallet per user |
| User            | sells        | Product          | 1:N         | Optional    | Only for Seller subtype |
| User            | has          | Cart             | 1:1         | Optional    | Created on demand |
| User            | places       | Order            | 1:N         | Optional    | Buyer subtype |
| User            | creates      | Ticket           | 1:N         | Optional    | Support flows |
| User            | writes       | TicketResponse   | 1:N         | Optional    | User or Support |
| User            | writes       | Review           | 1:N         | Optional    | Unique (user, product) |
| User            | has          | Wishlist         | 1:N         | Optional    | Unique (user, product) |
| User            | performs     | AuditLog         | 1:N         | Optional    | Action log |
| Wallet          | from         | Transaction      | 1:N         | Optional    | Outgoing transfers |
| Wallet          | to           | Transaction      | 1:N         | Optional    | Incoming transfers |
| Category        | parent       | Category         | 1:N         | Optional    | Hierarchical tree |
| Category        | contains     | Product          | 1:N         | Mandatory   | Product belongs to one category |
| Product         | has          | ProductFile      | 1:N         | Optional    | Additional files |
| Product         | appears_in   | CartItem         | 1:N         | Optional    | Through Cart |
| Product         | appears_in   | OrderItem        | 1:N         | Optional    | Through Order |
| Product         | receives     | Review           | 1:N         | Optional    | 1..5 rating |
| Product         | in           | Wishlist         | 1:N         | Optional    | Favorites |
| Cart            | contains     | CartItem         | 1:N         | Mandatory   | Weak entity logic |
| Order           | contains     | OrderItem        | 1:N         | Mandatory   | Associative |
| Ticket          | has          | TicketResponse   | 1:N         | Optional    | Conversation |
| Ticket          | assigned_to  | User             | N:1         | Optional    | Support agent |

## Foreign Key Map
- `wallets.user_id -> users.id`
- `products.seller_id -> users.id`
- `products.category_id -> categories.id`
- `product_files.product_id -> products.id`
- `carts.buyer_id -> users.id`
- `cart_items.cart_id -> carts.id`
- `cart_items.product_id -> products.id`
- `orders.buyer_id -> users.id`
- `order_items.order_id -> orders.id`
- `order_items.product_id -> products.id`
- `transactions.from_wallet_id -> wallets.id`
- `transactions.to_wallet_id -> wallets.id`
- `tickets.user_id -> users.id`
- `tickets.assigned_to -> users.id`
- `ticket_responses.ticket_id -> tickets.id`
- `ticket_responses.user_id -> users.id`
- `reviews.user_id -> users.id`
- `reviews.product_id -> products.id`
- `wishlists.user_id -> users.id`
- `wishlists.product_id -> products.id`
- `audit_logs.user_id -> users.id`



