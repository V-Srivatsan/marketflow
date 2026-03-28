from fastapi import APIRouter, HTTPException
from lib.cache import Cache
from lib.pubsub import PubSub
from logic.provider import StockProvider
from logic import patterns
from logic.event import Event
from models import stock as stock_models
import forms

router = APIRouter()
CACHE = Cache()
PUBSUB = PubSub(CACHE, "market_update")
PROVIDER: StockProvider | None = None

@router.post("/")
async def start_provider():
    global PROVIDER
    if PROVIDER is not None and PROVIDER.is_alive(): 
        raise HTTPException(status_code=400, detail="Provider already running")
    
    PROVIDER = StockProvider(update=2, trigger=10, publisher=PUBSUB)
    PROVIDER.start()
    return {"message": "Provider started"}

@router.delete("/")
async def stop_provider():
    global PROVIDER
    if PROVIDER is None or not PROVIDER.is_alive(): 
        raise HTTPException(status_code=400, detail="Provider not running")
    
    PROVIDER.started.clear()
    PROVIDER.join()
    return {"message": "Provider stopped"}


@router.post('/events')
def trigger_event(data: forms.StockEventForm):
    if PROVIDER is None or not PROVIDER.started.is_set(): raise HTTPException(428, detail={"message": "Stock provider is not running!"})

    for event in data.events:
        PROVIDER.add_pattern(event['id'], [
            Event(
                data_from=stock_models.StockEntry.from_json(CACHE.get(event['id'])).close, 
                data_to=event['to'],
                num_candles=event['duration']
            )
        ])

    return {"message": "Events added successfully!"}

@router.post('/patterns')
def trigger_pattern(data: forms.StockEventForm):
    if PROVIDER is None or not PROVIDER.started.is_set(): raise HTTPException(428, detail={"message": "Stock provider is not running!"})

    functions = {
        'bullish_flag': patterns.BULLISH_FLAG,
        'bearish_flag': patterns.BEARISH_FLAG,
        'bullish_pennant': patterns.BULLISH_PENNANT,
        'bearish_pennant': patterns.BEARISH_PENNANT,
        'double_top': patterns.DOUBLE_TOP,
        'double_bottom': patterns.DOUBLE_BOTTOM,
        'head_and_shoulders': patterns.HEAD_AND_SHOULDERS,
        'inverse_head_and_shoulders': patterns.INVERSE_HEAD_AND_SHOULDERS,
        'rising_wedge': patterns.RISING_WEDGE,
        'falling_wedge': patterns.FALLING_WEDGE,
        'rectangle': patterns.RECTANGLE,
        'cup_and_handle': patterns.CUP_AND_HANDLE,
        'inverted_cup_and_handle': patterns.INVERTED_CUP_AND_HANDLE,
    }

    for event in data.events:
        value = stock_models.StockEntry.from_json(CACHE.get(event['id'])).close

        if event['pattern'] not in functions: continue
        PROVIDER.add_pattern(
            event['id'], 
            functions[event['pattern']](value)
        )

    return {"message": "Patterns added successfully!"}