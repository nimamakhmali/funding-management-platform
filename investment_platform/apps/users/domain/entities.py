"""
User Domain Entity (Pure Python - no Django dependency)
"""
from dataclasses import dataclass
from datetime import datetime


@dataclass
class UserEntity:
    id: str
    email: str
    username: str
    role: str
    is_active: bool
    created_at: datetime
    phone_number: str | None
    
    @property
    def is_investor(self) -> bool:
        return self.role == "INVESTOR"

    @property
    def is_entrepreneur(self) -> bool:
        return self.role in {"ENTREPRENEUR", "PROJECT_OWNER"}

    @property
    def is_admin(self) -> bool:
        return self.role == "ADMIN"
