from lib.db import BaseModel, TimestampModel
from tortoise import fields
import json, pytz
from datetime import datetime

class Stock(BaseModel):
    name = fields.CharField(max_length=255)

class StockEntry(TimestampModel):
    stock = fields.ForeignKeyField("stock.Stock", related_name='entries', on_delete=fields.CASCADE)
    open = fields.FloatField()
    low = fields.FloatField()
    high = fields.FloatField()
    close = fields.FloatField()

    class Meta:
        unique_together = (('stock', 'timestamp'), )

    def __init__(self, value: float | None = None, **kwargs):
        if (value == None): super().__init__(**kwargs)
        else: super().__init__(**kwargs, open=value, close=value, low=value, high=value)

    def set_value(self, value: float):
        if value <= 0: value = 1
        
        self.low = min(self.low, value)
        self.high = max(self.high, value)
        self.close = value

    async def save(self, is_update: bool = True, *args, **kwargs):
        if not is_update: return await super().save(*args, **kwargs)

        await StockEntry.\
            filter(uid=self.uid).\
            update(close=self.close, low=self.low, high=self.high)
        
    @classmethod
    def from_json(cls, json_str: str | None):
        if json_str == None: raise Exception("String cannot be none!")

        data: dict = json.loads(json_str)
        data['timestamp'] = datetime.fromtimestamp(float(data['time'])/1000, tz=pytz.timezone('Asia/Kolkata'))
        return cls(None, **data)
    
    def to_dict(self): return {
        "uid": self.uid.hex,
        "open": self.open, "close": self.close,
        "low": self.low, "high": self.high,
        "time": int(self.timestamp.timestamp() * 1e3)
    }
    
    def __str__(self): return json.dumps(self.to_dict())