from lib.db import BaseModel
from tortoise import fields
import bcrypt

class User(BaseModel):
    username = fields.CharField(max_length=255, unique=True)
    password = fields.CharField(max_length=255)
    balance = fields.FloatField()
    verified = fields.BooleanField(default=False)

    def __init__(self, username: str, password: str, balance: float = 100000):
        hashed_pass = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        super().__init__(username=username, password=hashed_pass, balance=balance)

    def set_password(self, password: str):
        self.password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

    def verify(self, password: str): return bcrypt.checkpw(password.encode(), self.password.encode())