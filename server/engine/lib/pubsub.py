import redis
from .cache import Cache
from typing import Callable

class PubSub:
    __channel: str
    __client: redis.Redis
    __pubsub = None
    __thread = None

    def __init__(self, cache: Cache, channel: str):
        self.__channel = channel
        self.__client = cache.get_instance()
        self.__pubsub = self.__client.pubsub()

    def subscribe(self, callback: Callable):
        if self.__pubsub is not None:
            self.__pubsub.subscribe(**{self.__channel: callback})
            self.__thread = self.__pubsub.run_in_thread(sleep_time=0.001)

    def publish(self, message: str):
        self.__client.publish(self.__channel, message)

    def __del__(self):
        if self.__thread is not None: self.__thread.stop()
        if self.__pubsub is not None: self.__pubsub.close()