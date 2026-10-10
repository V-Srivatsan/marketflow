from fast_channels.consumer.websocket import AsyncJsonWebsocketConsumer
from fast_channels.layers import register_channel_layer
from fast_channels.layers.redis import RedisChannelLayer
import os

PROTOCOL = "rediss" if os.environ.get('CACHE_SSL', 'False').lower() == 'true' else "redis"

market_layer = RedisChannelLayer(hosts=[
    f'{PROTOCOL}://{os.environ["CACHE_HOST"]}:{os.environ["CACHE_PORT"]}'
])
register_channel_layer('market', market_layer)

class StockConsumer(AsyncJsonWebsocketConsumer):
    channel_layer_alias = 'market'

    async def connect(self):
        await self.accept()
        await self.channel_layer.group_add("stocks", self.channel_name)

    async def disconnect(self, code):
        await self.channel_layer.group_discard("stocks", self.channel_name)

    async def market_update(self, event):
        await self.send_json(event['data'])
    