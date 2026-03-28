import redis, os
from typing import Callable

class Cache:
    __cache: redis.Redis

    def __init__(self):
        self.__cache = redis.Redis(
            host=os.environ['CACHE_HOST'], 
            port=int(os.environ['CACHE_PORT'])
        )

    def set(self, key: str, value: str, exp: int = 10):
        self.__cache.set(key, value, ex=exp)

    def get(self, key: str) -> str:
        data: bytes | None = self.__cache.get(key) # type: ignore
        if data is None: raise Exception(f"Key does not exist: {key}")

        return data.decode()
    
    def get_instance(self): return self.__cache

    def __del__(self):
        self.__cache.close()



    