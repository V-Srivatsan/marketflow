from tortoise import Model, fields
import os, uuid, datetime, pytz

TORTOISE_ORM = {
    "connections": { "default": os.environ["DB_URL"] },

    "apps": {
        "user": {
            "models": ["models.user"],
            "default_connection": "default",
        },
        "stock": {
            "models": ["models.stock"],
            "default_connection": "default",
        },
        "transaction": {
            "models": ["models.transaction"],
            "default_connection": "default",
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