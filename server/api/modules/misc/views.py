from fastapi import APIRouter, Depends
from lib.cache import Cache
from lib.pubsub import PubSub
import asyncio
import middleware

from . import consumer, forms
from modules.user.models import User
from modules.user.logic import get_portfolio

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

    users = await User.filter(verified=True).all()
    for user in users:
        res[user.username] = (await get_portfolio(user.uid.hex))[0]

    return res