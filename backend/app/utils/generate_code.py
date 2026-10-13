import secrets


def generate_daily_code() -> str:
    """Генерация кода пользователя."""
    return "".join(secrets.choice("0123456789") for _ in range(6))
