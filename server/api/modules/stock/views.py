from fastapi import APIRouter, Depends
import requests, os, asyncio, json
import middleware
from lib.cache import Cache
from lib.pubsub import PubSub
from . import logic, consumer


def market_broadcast(msg):
    loop = asyncio.new_event_loop()
    loop.run_until_complete(consumer.market_layer.group_send(
        "stocks", 
        {
            "type": "market.update",
            "data": json.loads(msg['data'].decode('utf-8'))
        }
    ))
    loop.close()

CACHE = Cache()
MARKET_UPDATES = PubSub(CACHE, "market_update")
MARKET_UPDATES.subscribe(market_broadcast)

router = APIRouter()

@router.get('/')
async def get_stocks():
    return await logic.get_stocks()

router.add_websocket_route('/', consumer.StockConsumer.as_asgi())

@router.get('/mira/{stock_id}')
async def ask_mira(stock_id: str, user: str = Depends(middleware.get_user)):
    data = await logic.ask_mira(user, stock_id, CACHE)
    res = requests.post(os.environ['MIRA_HOST'], json=data)
    return res.json()