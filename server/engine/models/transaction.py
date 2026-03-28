from lib.db import BaseModel, TimestampModel
from tortoise import fields

class Transaction(TimestampModel):
    num_units = fields.IntField()
    price = fields.FloatField()
    stock = fields.ForeignKeyField('stock.Stock', on_delete=fields.CASCADE)
    user = fields.ForeignKeyField('user.User', on_delete=fields.CASCADE)


class Holding(BaseModel):
    stock = fields.ForeignKeyField('stock.Stock', on_delete=fields.CASCADE)
    user = fields.ForeignKeyField('user.User', on_delete=fields.CASCADE)
    quantity = fields.IntField()
    short_balance = fields.FloatField()
    avg_price = fields.FloatField()