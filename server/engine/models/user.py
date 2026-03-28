from lib.db import BaseModel
from tortoise import fields

class User(BaseModel):
    username = fields.CharField(max_length=255, unique=True)
    password = fields.CharField(max_length=255)
    balance = fields.FloatField()
    verified = fields.BooleanField(default=False)

