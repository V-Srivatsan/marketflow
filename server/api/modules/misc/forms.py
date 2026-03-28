from pydantic import BaseModel

class NewsForm(BaseModel):
    message: str