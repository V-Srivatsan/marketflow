from modules.stock import models

async def create_test_stocks():
    stocks = ["Apple Inc.", "Amazon", "Google"]
    for stock in stocks:
        obj = await models.Stock.create(name=stock)
        await models.StockEntry(value=5000, stock=obj).save(is_update=False)