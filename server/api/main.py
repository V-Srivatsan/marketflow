from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from tortoise.contrib.fastapi import register_tortoise
from lib.db import TORTOISE_ORM
register_tortoise(app, config=TORTOISE_ORM, generate_schemas=False)


from modules.user.views import router as user_router
app.include_router(user_router, prefix='/user')

from modules.stock.views import router as stock_router
app.include_router(stock_router, prefix='/stocks')

from modules.transaction.views import router as transaction_router
app.include_router(transaction_router, prefix='/transact')

from modules.misc.views import router as misc_router
app.include_router(misc_router)