from pydantic import BaseModel

class NewsForm(BaseModel):
    message: str

class LoginForm(BaseModel):
    username: str
    password: str

class StockEventForm(BaseModel):
    events: list[dict]

class UsersForm(BaseModel):
    users: list[str]