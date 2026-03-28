from fastapi import APIRouter, Depends
from lib.cache import Cache
from lib.pubsub import PubSub
import asyncio
import middleware

from . import consumer, forms
from modules.transaction import models as transaction_models
from modules.stock import models as stock_models

def news_broadcast(msg):
    print(msg, flush=True)
    loop = asyncio.new_event_loop()
    loop.run_until_complete(consumer.news_layer.group_send(
        "news", 
        {
            "type": "news.update",
            "data": { "message": msg['data'].decode('utf-8') }
        }
    ))
    loop.close()

router = APIRouter()
CACHE = Cache()
NEWS_UPDATES = PubSub(CACHE, "news_update")
NEWS_UPDATES.subscribe(news_broadcast)

@router.post('/news')
async def post_news(data: forms.NewsForm, _: None = Depends(middleware.check_admin)):
    NEWS_UPDATES.publish(data.message)
    return { "message": "News update sent successfully" }

router.add_websocket_route('/news/', consumer.NewsConsumer.as_asgi())



@router.get('/leaderboard')
async def get_leaderboard():
    res = {}
    holdings = await transaction_models.Holding.filter(user__verified=True).all().prefetch_related('user', 'stock')

    stocks = set([holding.stock.uid.hex for holding in holdings])
    prices = dict([
        (entry.uid.hex, entry.close)
        for entry in 
        (await stock_models.StockEntry.all().order_by("-timestamp")\
         .limit(len(stocks)).prefetch_related("stock"))
    ])

    for holding in holdings:
        user = holding.user
        res[user.username] = user.balance

    for holding in holdings:
        user = holding.user
        res[user.username] += holding.quantity * prices.get(holding.stock.uid.hex, 0)

    return res

