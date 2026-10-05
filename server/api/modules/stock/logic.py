import json
from lib.cache import Cache

from . import models
from modules.user.logic import get_portfolio
from modules.transaction.models import Holding

async def get_stocks():
    res: dict[str, dict] = {}
    entries = await models.StockEntry.all().order_by('timestamp').prefetch_related('stock')

    for entry in entries:
        stock_id = entry.stock.uid.hex
        if stock_id not in res:
            res[stock_id] = {
                'name': entry.stock.name,
                'entries': [],
            }

        res[stock_id]['entries'].append(entry.to_dict())

    return res


async def ask_mira(uid: str, stock_id: str, cache: Cache):
    portfolio = await get_portfolio(uid)
    holding = await Holding.get_or_none(user__uid=uid, stock__uid=stock_id)

    return {
        "price": json.loads(cache.get(stock_id))['close'],
        "cash": portfolio[1],
        "quantity": holding.quantity if holding is not None else 0,
        "short_balance": holding.short_balance if holding is not None else 0,
        "portfolio_val": portfolio[0],
    }