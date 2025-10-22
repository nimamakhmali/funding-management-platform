# ER Slices - Focused Views

This file contains smaller ER diagrams for focused areas to ease onboarding.

## Catalog and Content
```mermaid
erDiagram
    categories ||--o{ categories : parent
    categories ||--o{ products : contains
    products ||--o{ product_files : has
```

## Commerce Flow
```mermaid
erDiagram
    users ||--o{ carts : has
    carts ||--o{ cart_items : contains
    cart_items }o--|| products : contains

    users ||--o{ orders : places
    orders ||--o{ order_items : contains
    order_items }o--|| products : contains
```

## Finance
```mermaid
erDiagram
    users ||--|| wallets : owns
    wallets ||--o{ transactions : from
    wallets ||--o{ transactions : to
```

## Support and Feedback
```mermaid
erDiagram
    users ||--o{ tickets : creates
    tickets ||--o{ ticket_responses : has
    users ||--o{ reviews : writes
    products ||--o{ reviews : receives
```

## Compliance / Audit
```mermaid
erDiagram
    users ||--o{ audit_logs : performs
```



