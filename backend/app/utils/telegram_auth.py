import hashlib
import hmac

from app.config import settings

def verify_telegram_data(auth_data: str) -> bool:
    lines = auth_data.split("\n")
    data_dict = {}

    for line in lines:
        key, value = line.split("=", 1)
        data_dict[key] = value

    received_hash = data_dict.pop('hash')
    sorted_data = sorted(data_dict.items())
    data_check_string = "\n".join(f"{k}={v}" for k, v in sorted_data)

    secret_key = hmac.new(b"WebAppData", settings.TELEGRAM_BOT_TOKEN.encode(), hashlib.sha256).digest()
    calculated_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

    return calculated_hash == received_hash