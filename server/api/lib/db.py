from tortoise import Model, fields
import os, uuid
import datetime, pytz

TORTOISE_ORM = {
    "connections": { "default": os.environ["DB_URL"] },

    "apps": {
        "user": {
            "models": ["modules.user.models"],
            "default_connection": "default",
            "migrations": "modules.user.migrations"
        },
        "stock": {
            "models": ["modules.stock.models"],
            "default_connection": "default",
            "migrations": "modules.stock.migrations"
        },
        "transaction": {
            "models": ["modules.transaction.models"],
            "default_connection": "default",
            "migrations": "modules.transaction.migrations"
        }
    }
}

class BaseModel(Model):
    uid = fields.UUIDField(default=uuid.uuid4, unique=True)

    class Meta:
        abstract = True

class TimestampModel(BaseModel):
    timestamp = fields.DatetimeField()

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
        if not self.timestamp: self.timestamp = datetime.datetime.now(pytz.timezone('Asia/Kolkata'))

    class Meta:
        abstract = True