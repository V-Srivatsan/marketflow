from fastapi import FastAPI
app = FastAPI()

from tortoise.contrib.fastapi import register_tortoise
from lib.db import TORTOISE_ORM
register_tortoise(app, config=TORTOISE_ORM, generate_schemas=False)


from views import router
app.include_router(router)