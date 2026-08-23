from slowapi import Limiter
from slowapi.util import get_remote_address

# Shared slowapi limiter instance using remote client IP address
limiter = Limiter(key_func=get_remote_address)
