from fastapi import APIRouter, Depends
import requests, os, asyncio, json
import middleware
from lib.cache import Cache
from lib.pubsub import PubSub
from . import logic, consumer, forms


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

@router.post('/')
async def start_provider(_: None = Depends(middleware.check_admin)):
    requests.post(os.environ['ENGINE_HOST'] + '/')
    return {  "message": "Stock provider started successfully" }

@router.delete('/')
async def stop_provider(_: None = Depends(middleware.check_admin)):
    requests.delete(os.environ['ENGINE_HOST'] + '/')
    return {  "message": "Stock provider stopped successfully" }

@router.post('/events')
async def trigger_event(data: forms.StockEventForm, _: None = Depends(middleware.check_admin)):
    requests.post(os.environ['ENGINE_HOST'] + '/events', json={"events": data.events})
    return { "message": "Stock event triggered successfully" }

@router.post('/patterns')
async def trigger_pattern(data: forms.StockEventForm, _: None = Depends(middleware.check_admin)):
    requests.post(os.environ['ENGINE_HOST'] + '/patterns', json={"events": data.events})
    return { "message": "Stock pattern triggered successfully" }