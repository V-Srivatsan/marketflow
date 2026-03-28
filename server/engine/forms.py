from pydantic import BaseModel

class StockEventForm(BaseModel):
    events: list[dict]