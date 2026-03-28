from pydantic import BaseModel

class TransactForm(BaseModel):
    units: int