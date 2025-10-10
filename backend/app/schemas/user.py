from pydantic import BaseModel

class UserBase(BaseModel):
    telegram_id: str
    username: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int

    class Config:
        from_attributes = True