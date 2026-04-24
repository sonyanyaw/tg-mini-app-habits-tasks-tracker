

def get_telegram_id_by_user_id(db, user_id: str) -> str | None:
    user = db.query(User).filter(User.user_id == user_id).first()
    return user.telegram_id if user else None