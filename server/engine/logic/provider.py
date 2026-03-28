import threading
import datetime, pytz, time
import random
import asyncio
import json

from .event import Event
from models.stock import Stock, StockEntry
from models.transaction import Transaction


from lib.cache import Cache
from lib.pubsub import PubSub
CACHE = Cache()


class StockProvider(threading.Thread):
    __update: int
    __trigger: int
    __publisher: PubSub

    __events: dict[str, list[Event]]
    started: threading.Event

    def __init__(self, update: int, trigger: int, publisher: PubSub):
        super().__init__()
        self.__update = update
        self.__trigger = trigger
        self.__publisher = publisher

        self.__events = {}
        self.started = threading.Event()
    

    async def __get_updates(self, timestamp: datetime.datetime):
        txns = await Transaction.filter(timestamp__gt=timestamp).all().prefetch_related("stock")
        updates = {}
        for txn in txns:
            stock_id = txn.stock.uid.hex
            if stock_id not in updates: updates[stock_id] = 0
            updates[stock_id] += txn.num_units * txn.price * 0.001

        return updates

    async def __broadcast_updates(self,  stocks: list[Stock], cache: Cache, last_candle_update: bool):
        updates = {}
        values = await self.__get_updates(datetime.datetime.now() - datetime.timedelta(seconds=self.__update))
                
        for stock in stocks:
            entry = await StockEntry.from_json(cache.get(stock.uid.hex))
            entry.stock = stock
            value = entry.close

            if last_candle_update and len(self.__events[stock.uid.hex]) > 0:
                value = self.__events[stock.uid.hex][0].get_next()
                if self.__events[stock.uid.hex][0].is_finished():
                    self.__events[stock.uid.hex].pop(0)

            else:
                value += values.get(stock.uid.hex, 0)
                value += value * random.uniform(-0.01, 0.01)
            
            entry.set_value(value)
            await entry.save()
            updates[stock.uid.hex] = entry.to_dict()
            cache.set(stock.uid.hex, str(entry))
        
        self.__publisher.publish(json.dumps(updates))

    async def __main(self):
        if self.started.is_set(): return None
        self.started.set()

        cache = Cache()
        stocks = [i for i in await Stock.all()]

        for entry in await StockEntry.all().order_by("-timestamp")\
            .limit(len(stocks)).prefetch_related("stock"):
            
            cache.set(entry.stock.uid.hex, str(entry))
            self.__events[entry.stock.uid.hex] = []

        delta_time = 0
        while self.started.is_set():
                        
            if delta_time == self.__trigger:
                delta_time = 0

                updates = await self.__get_updates(datetime.datetime.now() - datetime.timedelta(seconds=self.__update))
                new_data = {}
                for stock in stocks:
                    entry = StockEntry.from_json(cache.get(stock.uid.hex))
                    
                    value = entry.close + updates.get(stock.uid.hex, 0) + \
                        abs(entry.open - entry.close) * random.uniform(-0.1, 0.1)

                    new_entry = StockEntry(stock=stock, value=value)
                    await new_entry.save(is_update=False)
                    cache.set(stock.uid.hex, str(new_entry))
                    new_data[stock.uid.hex] = new_entry.to_dict()

                self.__publisher.publish(json.dumps(new_data))

            else: await self.__broadcast_updates(
                stocks, cache,
                last_candle_update=(delta_time + self.__update == self.__trigger)
            )

            time.sleep(self.__update)
            delta_time += self.__update


    def add_pattern(self, stock_uid: str, events: list[Event]):
        self.__events[stock_uid] = events

    def run(self):
        asyncio.run(self.__main())
        while self.started.is_set():
            time.sleep(1)
