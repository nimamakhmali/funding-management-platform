"""
Settings module - loads settings based on DJANGO_ENV environment variable
Default is 'dev' for development
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
env = os.getenv('DJANGO_ENV', 'dev')
# Go up from: src/config/settings/__init__.py to backend/ (4 levels up)
# src/config/settings/ -> src/config/ -> src/ -> backend/
base_path = Path(__file__).resolve().parent.parent.parent.parent
env_file = base_path / f'.env.{env}'
default_env_file = base_path / '.env'

# Try to load environment-specific .env file, fallback to default .env
if env_file.exists():
    load_dotenv(env_file)
elif default_env_file.exists():
    load_dotenv(default_env_file)

if env == 'production':
    from .production import *
elif env == 'staging':
    from .staging import *
else:
    from .dev import *

