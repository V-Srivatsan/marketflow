from . import models

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